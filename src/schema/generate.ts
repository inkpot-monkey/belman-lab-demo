import { z } from 'zod';
import { stringify } from 'yaml';
import { BODY_FIELD, type CollectionSpec, type Field } from './fields.ts';

/** Zod type for one field, before optionality is applied. */
function zodForField(field: Field): z.ZodType {
  switch (field.widget) {
    case 'string':
    case 'text':
    case 'markdown':
    case 'image':
      return z.string();
    case 'number':
      return z.number();
    case 'boolean':
      return z.boolean();
    case 'datetime':
      return z.coerce.date();
    case 'select':
      return z.enum(field.options as [string, ...string[]]);
    case 'list':
      return z.array(zodForField(field.field));
    case 'object':
      return toZod(field.fields);
  }
}

/**
 * Build the Astro content schema. The Markdown body is skipped: Astro surfaces
 * it as rendered content, not as frontmatter, so requiring it here would fail
 * every entry.
 */
export function toZod(fields: Field[]): z.ZodObject<Record<string, z.ZodType>> {
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) {
    if (field.name === BODY_FIELD) continue;
    const base = zodForField(field);
    shape[field.name] = field.required === false ? base.optional() : base;
  }
  return z.object(shape);
}

/** Build the Sveltia field list. Sveltia treats fields as required by default. */
export function toSveltiaFields(fields: Field[]): unknown[] {
  return fields.map((field) => {
    const emitted: Record<string, unknown> = {
      name: field.name,
      label: field.label,
      widget: field.widget,
    };
    if (field.required === false) emitted.required = false;
    if (field.hint !== undefined) emitted.hint = field.hint;
    if (field.widget === 'select') emitted.options = field.options;
    if (field.widget === 'list') emitted.field = toSveltiaFields([field.field])[0];
    if (field.widget === 'object') emitted.fields = toSveltiaFields(field.fields);
    return emitted;
  });
}

export function toSveltiaCollection(spec: CollectionSpec): Record<string, unknown> {
  return {
    name: spec.name,
    label: spec.label,
    label_singular: spec.labelSingular,
    folder: spec.folder,
    create: true,
    extension: 'md',
    format: 'frontmatter',
    slug: '{{slug}}',
    fields: toSveltiaFields(spec.fields),
  };
}

export interface FileEntrySpec {
  name: string;
  label: string;
  /** Repo-relative path of the single file this entry edits. */
  file: string;
  fields: Field[];
}

/**
 * A collection of individually-named files rather than a folder of entries.
 * Used for things there is exactly one of - site details, footer - where
 * letting an editor create a second entry would be a footgun.
 */
export interface FileCollectionSpec {
  name: string;
  label: string;
  files: FileEntrySpec[];
}

export function toSveltiaFileCollection(spec: FileCollectionSpec): Record<string, unknown> {
  return {
    name: spec.name,
    label: spec.label,
    files: spec.files.map((entry) => ({
      name: entry.name,
      label: entry.label,
      file: entry.file,
      fields: toSveltiaFields(entry.fields),
    })),
  };
}

export interface CmsConfigInput {
  /** `owner/name` of the repository Sveltia commits to. */
  repo: string;
  branch: string;
  mediaFolder: string;
  publicFolder: string;
  collections: CollectionSpec[];
  fileCollections?: FileCollectionSpec[];
}

const HEADER = `# GENERATED FILE - DO NOT EDIT.
# Written by scripts/generate-cms-config.ts from src/schema/collections.ts.
# Edit the collection spec there and run \`pnpm gen:cms\`.
`;

export function generateCmsConfig({
  repo,
  branch,
  mediaFolder,
  publicFolder,
  collections,
  fileCollections = [],
}: CmsConfigInput): string {
  const config = {
    backend: {
      name: 'github',
      repo,
      branch,
      // No OAuth relay exists to sign in against, so offer only the personal
      // access token flow rather than a button that cannot work.
      auth_methods: ['token'],
      // Explicitly false, which is not the same as absent: absent hides the
      // publish UI entirely, false shows it and defaults each save to
      // publishing immediately.
      skip_ci: false,
    },
    media_folder: mediaFolder,
    public_folder: publicFolder,
    collections: [
      ...collections.map(toSveltiaCollection),
      ...fileCollections.map(toSveltiaFileCollection),
    ],
  };

  return HEADER + stringify(config, { lineWidth: 0 });
}
