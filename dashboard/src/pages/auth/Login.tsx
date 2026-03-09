import { useState } from 'react';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { OpenParishMark } from '@/components/OpenParishMark/OpenParishMark';
import { DEV_DEFAULT_OWNER_EMAIL, DEV_DEFAULT_OWNER_PASSWORD } from '@/config';
import { useAuth } from '@/context/AuthContext';
import type { LoginForm } from './Login.types';
import styles from './Login.module.css';

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
            Made for
            <br />
            <span className={styles.headlineAccent}>everyday parish work.</span>
          </h2>
          <p className={styles.subHeadline}>
            Create, find, and print baptism, confirmation, marriage, and death records in one place.
          </p>
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
