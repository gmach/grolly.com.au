import {
  Form,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect('/');
}

export default function DeleteContact() {
  const contact = useLoaderData();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Delete {contact.first} {contact.last} ?</span>
      </p>
      <p>
        <button type="submit">Delete</button>
        <button 
          type="button"
          onClick={() => {
            navigate(-1);
          }}>
            Cancel
        </button>
      </p>
    </Form>
  );
}