import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Box, Button, FormHelperText, TextField} from '@mui/material';
import {useAuth} from '../../hooks/use-auth';
import {useMounted} from '../../hooks/use-mounted';
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";

export const JWTLogin: FC = (props) => {
    const {t} = useTranslation();
    const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth() as any;
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
          .string()
          .email('이메일 형식이 올바르지 않습니다.')
          .max(255)
          .required(t("component_authentication_jwtLogin_textField_emailLabel")),
      //   .required('Email is required'),
      password: Yup
          .string()
          .max(255)
          .required(t("component_authentication_jwtLogin_textField_passwordLabel"))
      // .required('Password is required')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await login(values.email, values.password);

        if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string) || '/dashboard';
          router.push(returnUrl);
        }
        location.reload();
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({success: false});
          helpers.setErrors({submit: err.message});
          helpers.setSubmitting(false);
        }
      }
    }
  });

  const handleMove = () => {
    // router.push("/authentication/temporary-password");
    window.confirm('스타일봇 관리자(contact@stylebot.co.kr)에게 문의해주세요.')
  }

  const handleApply = () => {
    router.push("/apply-store/apply-store");
  }

  return (
      <form
          noValidate
          onSubmit={formik.handleSubmit}
          {...props}
      >
        <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            placeholder={t("component_authentication_jwtLogin_textField_emailLabel")}
            margin="normal"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
      />
      <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          placeholder={t("component_authentication_jwtLogin_textField_passwordLabel")}
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
        >
          {t("component_authentication_jwtLogin_textField_login")}
        </Button>
      </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            target="_blank"
            href={"https://forms.gle/DVqtujregHyehFxj6"}
            sx={{backgroundColor: '#D0BFFF', color: '#002984',
              "&.MuiButtonBase-root:hover": {
                backgroundColor: '#ccb7ff'
              }}}
          >
           {t('component_authentication_jwtLogin_textField_applyForService')}
          </Button>
        </Box>
        {/*<Box sx={{textAlign: 'right', mt: 2}}>*/}
        {/*  <Button*/}
        {/*      component="a"*/}
        {/*      variant="text"*/}
        {/*      onClick={handleMove}*/}
        {/*  >*/}
        {/*    {t("component_authentication_jwtLogin_button_passwordTemporary")}*/}
        {/*  </Button>*/}
        {/*</Box>*/}
        {/*<Box sx={{textAlign: 'center', mt: 5, mb: 2}}>*/}
        {/*  {t("component_authentication_jwtLogin_textField_applyStore")}*/}
        {/*</Box>*/}
        {/*<Box sx={{textAlign: 'center'}}>*/}
        {/*  <Button*/}
        {/*      component="a"*/}
        {/*      variant="outlined"*/}
        {/*      onClick={handleApply}*/}
        {/*  >*/}
        {/*    {t("component_authentication_jwtLogin_button_applyStore")}*/}
        {/*  </Button>*/}
        {/*</Box>*/}
        <Box sx={{textAlign: 'center', mt: 12}}>
          <Button disabled>{t("component_authentication_jwtLogin_textField_companyInfo")}</Button>
          <Button disabled>{t("component_authentication_jwtLogin_textField_companyAddress")}</Button>
        </Box>
        <Box sx={{textAlign: 'center'}}>
          <Button
            target="_blank"
            href={"https://image.stylebot.io/privacy_policy.html"}
            variant="text">{t("component_authentication_jwtLogin_button_tenorGuide")}</Button>
          <Button disabled>{'|'}</Button>
          <Button
            target="_blank"
            href={"https://image.stylebot.io/service_terms.html"}
            variant="text">{t("component_authentication_jwtLogin_button_termsGuide")}</Button>
        </Box>
      </form>
  );
};
