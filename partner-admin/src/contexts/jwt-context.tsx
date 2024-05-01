import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../api/auth-api';
import type { User } from '../types/user';
import type {Token} from "../types/auth";
import {toast} from "react-hot-toast";
import {endPointConfig} from "../config";
import {partnerAuthApi} from "../api/partner-auth-api";
import moment from "moment";

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
      const token: Token = await partnerAuthApi.partnerLogin({email, password})
      const user = await authApi.me(token.accessToken);

      const allowLoginAuth = ['ROLE_ADMIN_PARTNER', 'ROLE_ADMIN_MASTER', 'ROLE_ADMIN', 'ROLE_ADMIN_CC', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT', 'ROLE_ADMIN_PICK', 'ROLE_ADMIN_PRODUCT', 'ROLE_ADMIN_CS', 'ROLE_ADMIN_STATISTICS', 'ROLE_WORKER_PICK', 'ROLE_WORKER_USERFIT', 'ROLE_WORKER_PRODUCTFIT', 'ROLE_USER'];
      let allow = false;
      allowLoginAuth.forEach(allowAuth => {
          if (user.auth.indexOf(allowAuth) != -1) {
              allow = true;
          }
      })


      if (allow) {
          console.log('token#####', token, user)
          localStorage.setItem('accessToken', token.accessToken);
          localStorage.setItem('refreshToken', token.refreshToken);
          localStorage.setItem('cafe24Domain', `https://${user.mallName}.${endPointConfig.styleBotCafe24}`);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('email', email);
          localStorage.setItem('mallId', user.mallId);
          localStorage.setItem('mallName', user.mallName);
          localStorage.setItem('mallGender', user.mallGender);
          localStorage.setItem('expired', String(token.expired));
          localStorage.setItem('cafe24AccessToken', user.mallAccessToken);

          if (token.dDay >= -7 && localStorage.getItem('expired') == 'false') {
              window.confirm(
                  `곧 피팅룸 구독 서비스가 만료됩니다. (주)스타일봇 담당자에게 문의하여 구독기간을 연장해주세요.\nD-${Math.abs(token.dDay)}\n구독기간 : ${moment(token.planStartDate).format('YYYY.MM.DD')} ~ ${moment(token.planEndDate).format('YYYY.MM.DD')}`
              )
          } else if (localStorage.getItem('expired') == 'true') {
              window.confirm('현재 피팅룸 구독기간이 만료되어 이용이 불가합니다.\n(주)스타일봇 담당자에게 문의 부탁드립니다.')
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
          dispatch({type: 'LOGOUT'});
      }
  };

  const logout = async (): Promise<void> => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('cafe24AccessToken');
      localStorage.removeItem('cafe24RefreshToken');
      dispatch({type: 'LOGOUT'});
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
