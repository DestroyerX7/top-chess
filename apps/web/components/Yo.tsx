"use client";

import { TopChessPlayer } from "@top-chess/db/types";
import { Input } from "./ui/input";
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldDescription,
  Field,
} from "./ui/field";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { getWikiPages, WikiPage } from "@/lib/wikipedia";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import Image from "next/image";
import axios from "axios";

type Props = {
  topChessPlayer: TopChessPlayer;
};

export default function Yo({ topChessPlayer }: Props) {
  const [name, setName] = useState(topChessPlayer.name);
  const [pages, setPages] = useState<WikiPage[] | null>(null);

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 1) {
      return;
    }

    const response = await axios.get<WikiPage[]>("/api/wiki-pages", {
      params: {
        search: name,
      },
    });

    setPages(response.data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <FieldSet>
          <FieldLegend>Wikipedia Search</FieldLegend>

          <FieldDescription>
            Search wikipedia for a chess player to see if they have a page
          </FieldDescription>

          <FieldGroup>
            <Field>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field orientation="horizontal">
              <Button type="submit">Search</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>

      {pages !== null && (
        <div>
          {pages.map((p) => (
            <Item key={p.pageid}>
              <ItemMedia variant="image">
                {p.thumbnail !== undefined ? (
                  <Image
                    src={p.thumbnail.source}
                    alt={p.title}
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="https://avatar.vercel.sh/Midnight%20City%20Lights"
                    alt="Midnight City Lights"
                    width={32}
                    height={32}
                    className="object-cover grayscale"
                  />
                )}
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{p.title}</ItemTitle>

                <ItemDescription>{p.description}</ItemDescription>

                <ItemDescription>{p.fullurl}</ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button variant="outline">Apply</Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}
