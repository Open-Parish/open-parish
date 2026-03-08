import { useState } from 'react';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { DEV_DEFAULT_OWNER_EMAIL, DEV_DEFAULT_OWNER_PASSWORD } from '@/config';
import { useAuth } from '@/context/AuthContext';
import styles from './Login.module.css';

function OpenParishMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" rx="8" fill="currentColor" opacity="0.15" />
      <path d="M20 9v6M17 12h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 19l9-7 9 7v12H11V19z" fill="currentColor" />
      <rect x="17.5" y="22.5" width="5" height="8.5" rx="1" fill="white" />
    </svg>
  );
}

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    initialValues: {
      email: DEV_DEFAULT_OWNER_EMAIL ?? '',
      password: DEV_DEFAULT_OWNER_PASSWORD ?? '',
    },
    validate: {
      email: (value) => (!value.trim() ? 'Email is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  return (
    <div className={styles.root}>
      <div className={styles.brand}>
        <div className={styles.geo}>
          <div className={styles.geoGrid} />
          <div className={styles.geoRing1} />
          <div className={styles.geoRing2} />
          <div className={styles.geoDot1} />
          <div className={styles.geoDot2} />
          <div className={styles.geoGlow} />
        </div>

        <div className={styles.brandInner}>
          <div className={styles.logo}>
            <OpenParishMark className={styles.logoMark} />
            <span className={styles.logoText}>Open Parish</span>
          </div>

          <h2 className={styles.headline}>
            The workspace
            <br />
            built for <span className={styles.headlineAccent}>speed.</span>
          </h2>
          <p className={styles.subHeadline}>Manage everything in one place — fast, flexible, and always in control.</p>
        </div>

        <div className={styles.brandFooter}>© {new Date().getFullYear()} Open Parish</div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <div className={styles.formEyebrow}>Secure login</div>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your account to continue.</p>
          </div>

          <form
            className={styles.formBody}
            onSubmit={form.onSubmit(async (values) => {
              setError(null);
              try {
                await login({ email: values.email.trim(), password: values.password });
                navigate('/dashboard', { replace: true });
              } catch {
                setError('Invalid email or password.');
              }
            })}
          >
            <TextInput
              label="Email address"
              placeholder="admin@example.com"
              data-testid="login-email"
              classNames={{ label: styles.inputLabel, input: styles.inputField }}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              data-testid="login-password"
              classNames={{ label: styles.inputLabel, input: styles.inputField }}
              {...form.getInputProps('password')}
            />

            {error && <div className={styles.errorBox}>{error}</div>}

            <Button type="submit" fullWidth data-testid="login-submit" className={styles.submitBtn}>
              Sign in →
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
