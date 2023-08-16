/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formExampleSchema = z
  .object({
    name: z.string(),
    includeNote: z.boolean(),
    note: z.string().optional(),
  })
  .required();

type FormExample = z.infer<typeof formExampleSchema>;

function FormPage() {
  const { register, handleSubmit, watch } = useForm<FormExample>({
    resolver: zodResolver(formExampleSchema),
  });

  const onSubmit = handleSubmit((data) => console.log(data));

  const includeNote = watch("includeNote");

  return (
    <div>
      <form>
        <div>
          <label>Name</label>
          <input {...register("name")} />
        </div>
        <div>
          <label>More details</label>
          <input type="checkbox" {...register("includeNote")} />
        </div>
        {includeNote && (
          <div>
            <label>Include note</label>
            <input type="text" {...register("note")} />
          </div>
        )}

        <button type="submit" onSubmit={onSubmit} />
      </form>
    </div>
  );
}

export default FormPage;
