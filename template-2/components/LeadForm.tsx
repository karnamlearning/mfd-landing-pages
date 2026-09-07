"use client";

import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "sonner";
import styled from "styled-components";
import { horizons, incomeRanges, netWorthRanges } from "@/lib/site";
import { Button } from "@/components/ui";

const nameField = Yup.string().trim().min(2, "Please enter your name").required("Please enter your name");
const emailField = Yup.string().email("Enter a valid email").required("Please enter your email");
const phoneField = Yup.string()
  .required("Please enter your mobile number")
  .test("phone", "Enter a valid Indian mobile number", (value) => {
    const parsed = parsePhoneNumberFromString(value || "", "IN");
    return parsed?.isValid() ?? false;
  });
const messageField = Yup.string().max(600, "Please keep this under 600 characters");

const Schema = Yup.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  incomeRange: Yup.string().required("Please select an income range"),
  netWorth: Yup.string().required("Please select a range"),
  horizon: Yup.string().required("Please select a horizon"),
  message: messageField,
});

/** Homepage form: identity plus a free-text line. Nothing else can block submit. */
const CompactSchema = Yup.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  incomeRange: Yup.string(),
  netWorth: Yup.string(),
  horizon: Yup.string(),
  message: messageField,
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  incomeRange: "",
  netWorth: "",
  horizon: "",
  message: "",
};

type Values = typeof initialValues;
type FieldName = keyof Values;

const Fields = styled.div`
  display: grid;
  gap: 22px;
`;

/* Labels are tiny tracked capitals; inputs are a single hairline underneath. */
const Label = styled.label`
  display: grid;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
`;

const inputCss = `
  width: 100%;
  min-height: 42px;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid var(--line-strong);
  border-radius: 0;
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: rgb(var(--seed-muted) / 0.7);
  }

  &:focus {
    outline: none;
    border-bottom-color: var(--brand);
  }

  &[aria-invalid="true"] {
    border-bottom-color: var(--danger);
  }
`;

const Input = styled.input`
  ${inputCss}
`;

const Select = styled.select`
  ${inputCss}
  cursor: pointer;
`;

const Area = styled.textarea`
  ${inputCss}
  min-height: 88px;
  resize: vertical;
  line-height: 1.5;
`;

const ErrorText = styled.div`
  color: var(--danger);
  font-size: 12px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  margin-top: 4px;
`;

const Two = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Errors only appear after the visitor has pressed Submit at least once.
 * Before that, tabbing through the form or typing a partial phone number
 * shows nothing. After the first submit, errors update live so each one
 * disappears as soon as the field is fixed.
 */
function useShownError(name: FieldName) {
  const { errors, submitCount } = useFormikContext<Values>();
  return submitCount > 0 ? errors[name] : undefined;
}

function FieldError({ name }: { name: FieldName }) {
  const error = useShownError(name);
  return error ? <ErrorText role="alert">{error}</ErrorText> : null;
}

function TextInput({
  name,
  type = "text",
  placeholder,
}: {
  name: FieldName;
  type?: string;
  placeholder?: string;
}) {
  const error = useShownError(name);
  return (
    <Field name={name}>
      {({ field }: { field: object }) => (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? "true" : undefined}
        />
      )}
    </Field>
  );
}

function SelectInput({
  name,
  options,
}: {
  name: FieldName;
  options: readonly string[];
}) {
  const error = useShownError(name);
  return (
    <Field name={name}>
      {({ field }: { field: object }) => (
        <Select {...field} aria-invalid={error ? "true" : undefined}>
          <option value="">Select</option>
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      )}
    </Field>
  );
}

async function submitLead(values: Values) {
  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, source: "website" }),
    });
  } catch {
    // Route handler is a stub until the CRM is wired.
  }
}

export function LeadForm({
  compact = false,
  cta = "Request a callback",
}: {
  compact?: boolean;
  cta?: string;
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={compact ? CompactSchema : Schema}
      validateOnMount={false}
      validateOnBlur={false}
      validateOnChange
      onSubmit={async (values, helpers) => {
        await submitLead(values);
        toast.success("Thank you. We will call you back shortly.");
        helpers.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <Fields>
            <Label>
              Your name
              <TextInput name="name" placeholder="First and last name" />
              <FieldError name="name" />
            </Label>
            {compact ? (
              <>
                <Two>
                  <Label>
                    Email
                    <TextInput name="email" type="email" placeholder="you@email.com" />
                    <FieldError name="email" />
                  </Label>
                  <Label>
                    Mobile
                    <TextInput name="phone" type="tel" placeholder="98765 43210" />
                    <FieldError name="phone" />
                  </Label>
                </Two>
                <Label>
                  What are you saving for?
                  <Field name="message">
                    {({ field }: { field: object }) => (
                      <Area
                        {...field}
                        placeholder="Roughly. A home, a child's education, retirement, or just 'I don't know where to start'."
                      />
                    )}
                  </Field>
                  <FieldError name="message" />
                </Label>
              </>
            ) : (
              <>
                <Two>
                  <Label>
                    Email
                    <TextInput name="email" type="email" placeholder="you@email.com" />
                    <FieldError name="email" />
                  </Label>
                  <Label>
                    Mobile
                    <TextInput name="phone" type="tel" placeholder="98765 43210" />
                    <FieldError name="phone" />
                  </Label>
                </Two>
                <Label>
                  Annual income
                  <SelectInput name="incomeRange" options={incomeRanges} />
                  <FieldError name="incomeRange" />
                </Label>
                <Two>
                  <Label>
                    Investible surplus
                    <SelectInput name="netWorth" options={netWorthRanges} />
                    <FieldError name="netWorth" />
                  </Label>
                  <Label>
                    Investment horizon
                    <SelectInput name="horizon" options={horizons} />
                    <FieldError name="horizon" />
                  </Label>
                </Two>
                <Label>
                  How can we help?
                  <Field name="message">
                    {({ field }: { field: object }) => (
                      <Area
                        {...field}
                        placeholder="Your goals, questions, or a preferred time to talk"
                      />
                    )}
                  </Field>
                  <FieldError name="message" />
                </Label>
              </>
            )}
            <Button type="submit" disabled={isSubmitting} style={{ marginTop: 6 }}>
              {isSubmitting ? "Sending..." : cta}
            </Button>
          </Fields>
        </Form>
      )}
    </Formik>
  );
}
