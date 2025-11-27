import { Formik, Form, Field, ErrorMessage as FE } from 'formik';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';
import css from './NoteForm.module.css';

interface NoteFormValues {
  title: string;
  content?: string;
  tag: string;
}

interface NoteFormProps {
  onCancel: () => void;
}

const schema = yup.object({
  title: yup.string().min(3).max(50).required('Title required'),
  content: yup.string().max(500),
  tag: yup
    .string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag required'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel(); // закриваємо модалку після успіху
      toast.success('Note created!');
    },
    onError: (err) => {
      console.error('Create note error:', err);
      toast.error('Failed to create note');
    },
  });

  const initial: NoteFormValues = { title: '', content: '', tag: 'Todo' };

  return (
    <Formik
      initialValues={initial}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await mutation.mutateAsync(values);
          resetForm();
        } catch {
          // обробка помилки вже в onError мутації
        }
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <span className={css.error}>
              <FE name="title" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" rows={6} className={css.textarea} />
            <span className={css.error}>
              <FE name="content" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <span className={css.error}>
              <FE name="tag" />
            </span>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
