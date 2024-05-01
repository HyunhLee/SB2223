import type {FC, ReactNode} from 'react';
import {createContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {authApi} from '../api/auth-api';
import type {User} from '../types/user';
import type {Token} from "../types/auth";
import {toast} from "react-hot-toast";
import {partnerAuthApi} from "../api/partner-auth-api";
import {handsomeAuthApi} from "../handsome-api/auth-api";

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: User;
  };
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          const user = await authApi.me(accessToken);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const token:Token = await authApi.login({ email, password });
    const user = await authApi.me(token.accessToken);
    const allowLoginAuth = ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN', 'ROLE_ADMIN_CC', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT', 'ROLE_ADMIN_PICK', 'ROLE_ADMIN_PRODUCT', 'ROLE_ADMIN_CS', 'ROLE_ADMIN_STATISTICS', 'ROLE_WORKER_PICK', 'ROLE_WORKER_USERFIT', 'ROLE_WORKER_PRODUCTFIT', 'ROLE_ADMIN_BRAND', 'ROLE_PARTNER_B2B'];
    const allowHandsomeLoginAuth = ['ROLE_ADMIN_MASTER', 'ROLE_HANDSOME_PRODUCTFIT', 'ROLE_HANDSOME_PRODUCT', 'ROLE_WORKER_HANDSOME'];
    const allowPartnerLoginAuth = ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'];
    let allow = false;
    let handsomeAllow = false;
    let partnerAllow = false;
    allowLoginAuth.forEach(allowAuth => {
      if (user.auth.indexOf(allowAuth) != -1) {
        allow = true;
      }
    })
    allowPartnerLoginAuth.forEach(allowAuth => {
      if(user.auth.indexOf(allowAuth) != -1) {
        partnerAllow = true;
      }
    })
    allowHandsomeLoginAuth.forEach(allowAuth => {
      if (user.auth.indexOf(allowAuth) != -1) {
        handsomeAllow = true;
      }
    })

    if (allow) {
      localStorage.setItem('accessToken', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
      console.log('### accessToken : ', token.accessToken);
      console.log('### refreshToken : ', token.refreshToken);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('email', email);

      if (handsomeAllow) {
        console.log('handsome Allow')
        await handsomeAuthApi.login().then(
          async (token) => {
            localStorage.setItem('handsomeAccessToken', token.accessToken);
            localStorage.setItem('handsomeRefreshToken', token.refreshToken);
          }
        ).catch(err => {
          localStorage.removeItem('handsomeAccessToken');
          localStorage.removeItem('handsomeRefreshToken');
          console.log(err)
          window.location.href = "/";
        });
        if (partnerAllow) {
          console.log('handsome-partnerAllow')
          await partnerAuthApi.partnerLogin({email, password}).then((result) => {
            localStorage.setItem('partnerAccessToken', result.accessToken);
            localStorage.setItem('partnerRefreshToken', result.refreshToken);
          });
        }
      }else if (partnerAllow) {
        console.log('partnerAllow')
        //한섬 권한없이 바로 파트너 권한있는지 체킹후 토큰 발급 진행
        const result = await partnerAuthApi.partnerLogin({email, password});
        localStorage.setItem('partnerAccessToken', result.accessToken);
        localStorage.setItem('partnerRefreshToken', result.refreshToken);
        console.log('### partnerAccessToken : ', result.accessToken);
        console.log('### partnerRefreshToken : ', result.refreshToken);
      }

      dispatch({
        type: 'LOGIN',
        payload: {
          user
        }
      });
    } else {
      toast.error('접근 권한이 없는 사용자입니다. 관리자에게 문의해주세요.')
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('handsomeAccessToken');
      localStorage.removeItem('handsomeRefreshToken');
      localStorage.removeItem('partnerAccessToken');
      localStorage.removeItem('partnerRefreshToken');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('handsomeAccessToken');
    localStorage.removeItem('handsomeRefreshToken');
    localStorage.removeItem('partnerAccessToken');
    localStorage.removeItem('partnerRefreshToken');

    dispatch({ type: 'LOGOUT' });
  };

  const register = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {
    const accessToken = await authApi.register({ email, name, password });
    const user = await authApi.me(accessToken);

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
