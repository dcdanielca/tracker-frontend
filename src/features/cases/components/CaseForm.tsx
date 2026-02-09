import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createCaseSchema, CreateCaseFormData } from "@/schemas/caseSchema";
import { CASE_TYPES, PRIORITIES } from "@/utils/constants";
import { useCreateCase } from "../hooks/useCreateCase";

export function CaseForm() {
  const createCase = useCreateCase();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      queries: [
        {
          database_name: "",
          schema_name: "",
          query_text: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "queries",
  });

  const onSubmit = (data: CreateCaseFormData) => {
    createCase.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Caso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Título"
            placeholder="Título del caso"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el caso en detalle"
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              label="Tipo de Caso"
              options={CASE_TYPES}
              error={errors.case_type?.message}
              {...register("case_type")}
            />

            <Select
              label="Prioridad"
              options={PRIORITIES}
              error={errors.priority?.message}
              {...register("priority")}
            />

            <Input
              label="Creado por"
              placeholder="Tu nombre"
              error={errors.created_by?.message}
              {...register("created_by")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Queries</CardTitle>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                append({
                  database_name: "",
                  schema_name: "",
                  query_text: "",
                })
              }
              disabled={fields.length >= 10}
            >
              Agregar Query
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Query {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Base de Datos"
                  placeholder="Nombre de la base de datos"
                  error={errors.queries?.[index]?.database_name?.message}
                  {...register(`queries.${index}.database_name`)}
                />

                <Input
                  label="Schema"
                  placeholder="Nombre del schema"
                  error={errors.queries?.[index]?.schema_name?.message}
                  {...register(`queries.${index}.schema_name`)}
                />
              </div>

              <Textarea
                label="Query SQL"
                placeholder="SELECT * FROM ..."
                rows={4}
                error={errors.queries?.[index]?.query_text?.message}
                {...register(`queries.${index}.query_text`)}
              />
            </div>
          ))}

          {errors.queries?.message && (
            <p className="text-sm text-red-600">{errors.queries.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={createCase.isPending}>
          Crear Caso
        </Button>
      </div>
    </form>
  );
}
