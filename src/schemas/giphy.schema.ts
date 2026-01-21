import { z } from "zod";

export const giphyGifSchema = z.object({
  id: z.string(),
  title: z.string().optional().default(""),
  url: z.string().optional(),
  images: z.object({
    fixed_width: z.object({
      url: z.string(),
      width: z.string().optional(),
      height: z.string().optional(),
    }),
    original: z.object({
      url: z.string(),
      width: z.string().optional(),
      height: z.string().optional(),
    }),
  }),
});

export const giphyPaginationSchema = z
  .object({
    total_count: z.number(),
    count: z.number(),
    offset: z.number(),
  })
  .optional();

export const giphyMetaSchema = z.object({
  status: z.number(),
  msg: z.string().optional(),
  response_id: z.string().optional(),
});

export const giphySearchResponseSchema = z.object({
  data: z.array(giphyGifSchema),
  pagination: giphyPaginationSchema,
  meta: giphyMetaSchema,
});

export const giphyGetByIdResponseSchema = z.object({
  data: giphyGifSchema,
  meta: giphyMetaSchema,
});

export type GiphyGif = z.infer<typeof giphyGifSchema>;
export type GiphySearchResponse = z.infer<typeof giphySearchResponseSchema>;
export type GiphyGetByIdResponse = z.infer<typeof giphyGetByIdResponseSchema>;
