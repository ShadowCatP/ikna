import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FieldApi, FormApi } from '@tanstack/react-form';
import { getAuthSchema, resetPasswordSchema } from '../utils/auth-schemas.ts';
import {
  parseRecoveryLink,
  verifyRecoveryLink,
} from '../utils/auth-recovery.ts';

test('registration validates each step and retains credentials going back', async () => {
  let step = 1;
  let accountsCreated = 0;
  const values = {
    email: 'anna@example.com',
    password: 'password123',
    name: '',
  };
  const options = () => ({
    defaultValues: values,
    validators: { onSubmit: getAuthSchema('signUp', step) },
    onSubmit: () => {
      if (step === 1) step = 2;
      else accountsCreated++;
    },
  });
  const form = new FormApi(options());
  const unmount = form.mount();
  await form.handleSubmit();
  assert.equal(step, 2);
  assert.equal(accountsCreated, 0);
  form.update(options());
  form.setFieldValue('name', 'Anna');
  step = 1;
  form.update(options());
  assert.equal(form.state.values.email, values.email);
  assert.equal(form.state.values.password, values.password);
  assert.equal(form.state.values.name, 'Anna');
  await form.handleSubmit();
  form.update(options());
  await form.handleSubmit();
  assert.equal(accountsCreated, 1);
  unmount();
});

test('forgot-password accepts just an email, registration still requires a password', () => {
  const values = { email: ' anna@example.com ', password: '', name: '' };
  assert.equal(
    getAuthSchema('forgot', 1).parse(values).email,
    'anna@example.com'
  );
  assert.equal(getAuthSchema('signUp', 1).safeParse(values).success, false);
  assert.equal(
    getAuthSchema('forgot', 1).safeParse({ ...values, email: 'invalid' })
      .success,
    false
  );
});

test('a mismatched reset password can be corrected and submitted', async () => {
  let saved = false;
  const form = new FormApi({
    defaultValues: { password: 'password123', confirm: 'different' },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: () => {
      saved = true;
    },
  });
  const unmount = form.mount();
  const password = new FieldApi({ form, name: 'password' });
  const confirm = new FieldApi({ form, name: 'confirm' });
  const unmountPassword = password.mount();
  const unmountConfirm = confirm.mount();
  await form.handleSubmit();
  assert.equal(saved, false);
  confirm.handleChange('password123');
  await form.handleSubmit();
  assert.equal(saved, true);
  unmountConfirm();
  unmountPassword();
  unmount();
});

test('invalid, expired and non-recovery links never set a session', async () => {
  let calls = 0;
  const auth = {
    setSession: async () => {
      calls++;
      return { error: null };
    },
  };
  for (const url of [
    'not-a-url',
    'ikna://reset-password',
    'ikna://reset-password#type=recovery&access_token=test',
    'ikna://reset-password#type=signup&access_token=test&refresh_token=test',
    'ikna://reset-password?error_description=expired#type=recovery&access_token=test&refresh_token=test',
  ]) {
    await assert.rejects(verifyRecoveryLink(url, auth), /invalid or expired/);
  }
  assert.equal(calls, 0);
});

test('valid recovery links establish a session and server failures remain errors', async () => {
  const url =
    'ikna://reset-password#type=recovery&access_token=test-access&refresh_token=test-refresh';
  const tokens = parseRecoveryLink(url);
  await verifyRecoveryLink(url, {
    setSession: async (received) => {
      assert.deepEqual(received, tokens);
      return { error: null };
    },
  });
  await assert.rejects(
    verifyRecoveryLink(url, {
      setSession: async () => ({ error: new Error('expired') }),
    }),
    /invalid or expired/
  );
});
