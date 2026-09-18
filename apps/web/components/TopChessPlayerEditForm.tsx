"use client";

import { TopChessPlayer } from "@top-chess/db/types";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";

type Props = {
  topChessPlayer: TopChessPlayer;
};

const topChessPlayerFormSchema = z.object({
  wikipediaUrl: z.httpUrl().nullable().optional(),
  imageUrl: z.httpUrl().nullable().optional(),
  description: z.string().min(1).nullable().optional(),
  bio: z.string().min(1).nullable().optional(),
});

type TopChessPlayerFormValues = z.infer<typeof topChessPlayerFormSchema>;

export default function TopChessPlayerEditForm({ topChessPlayer }: Props) {
  const { handleSubmit, control, formState, reset } =
    useForm<TopChessPlayerFormValues>({
      resolver: zodResolver(topChessPlayerFormSchema),
      defaultValues: {
        wikipediaUrl: topChessPlayer.wikipediaUrl,
        imageUrl: topChessPlayer.imageUrl,
        description: topChessPlayer.description,
        bio: topChessPlayer.bio,
      },
    });

  const onSubmit = async ({
    wikipediaUrl,
    imageUrl,
    description,
    bio,
  }: TopChessPlayerFormValues) => {
    const response = await axios.patch<TopChessPlayer>(
      `/api/top-chess-player/${topChessPlayer.fideId}`,
      {
        wikipediaUrl,
        imageUrl,
        description,
        bio,
      },
    );

    reset(response.data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Top Chess Player Data</FieldLegend>

        <FieldDescription>
          Edit data from {topChessPlayer.name}
        </FieldDescription>

        <FieldGroup>
          <Controller
            name="wikipediaUrl"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Wikipedia url</FieldLabel>

                <Input
                  placeholder="Wikipedia url"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </Field>
            )}
          />

          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Image url</FieldLabel>

                <Input
                  placeholder="Image url"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>

                <Input
                  placeholder="Description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </Field>
            )}
          />

          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Bio</FieldLabel>

                <Textarea
                  placeholder="Bio"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </Field>
            )}
          />

          <Field orientation="horizontal">
            <Button
              type="submit"
              disabled={!formState.isDirty || formState.isSubmitting}
            >
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
