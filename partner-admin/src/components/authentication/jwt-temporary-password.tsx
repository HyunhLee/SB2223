import type {ChangeEvent, FC} from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Box, Button, FormHelperText, TextField} from '@mui/material';
import {useAuth} from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import {useState} from "react";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

export const JWTTemporaryPassword: FC = (props) => {
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
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup
                .string()
                .max(255)
                .required('Password is required')
        }),
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                await login(values.email, values.password);

                if (isMounted()) {
                    const returnUrl = (router.query.returnUrl as string) || '/dashboard';
                    router.push(returnUrl);
                }
            } catch (err) {
                console.error(err);

                if (isMounted()) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                }
            }
        }
    });

    const [confirm, setConfirm] = useState(false);
    const [email, setEmail] = useState("");

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    }

    const handleConfirm = () => {
        const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if (email == "") {
            toast.error(`${t("component_authentication_jwtTemporaryPassword_toast_emptyEmail")}`)
        } else if (!exptext.test(email)) {
            toast.error(`${t("component_authentication_jwtTemporaryPassword_toast_falseEmail")}`)
        } else if (email !== "") {
            setConfirm(true);
        }
    }

    const handleMoveLogin = () => {
        router.push("/authentication/login");
    }

    return (
        <form
            noValidate
            onSubmit={formik.handleSubmit}
            {...props}
        >
            <Box sx={{textAlign: 'center'}}>
                {!confirm ?
                    `${t("component_authentication_jwtTemporaryPassword_textField_guideHeader")}`
                    :
                    `${t("component_authentication_jwtTemporaryPassword_textField_confirmHeader")}`}
            </Box>
            <Box sx={{textAlign: 'center'}}>
                {!confirm ?
                    `${t("component_authentication_jwtTemporaryPassword_textField_guideBody")}`
                    :
                    `${t("component_authentication_jwtTemporaryPassword_textField_confirmBody")}`}
            </Box>
            {!confirm ? <TextField
                autoFocus
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                label={t("component_authentication_jwtLogin_textField_emailLabel")}
                margin="normal"
                name="email"
                onChange={handleChangeEmail}
                type="email"
            /> : null}
            {formik.errors.submit && (
                <Box sx={{ mt: 3 }}>
                    <FormHelperText error>
                        {formik.errors.submit}
                    </FormHelperText>
                </Box>
            )}
            <Box sx={{ mt: 2 }}>
                {!confirm ?
                    <Button
                        disabled={formik.isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={handleConfirm}
                    >
                        {t("component_authentication_jwtTemporaryPassword_button_confirm")}
                    </Button>
                    :
                    <Button
                        component="a"
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={handleMoveLogin}
                    >
                        {t("component_authentication_jwtTemporaryPassword_button_moveLoginPage")}
                    </Button>
                }
            </Box>
        </form>
    );
};
