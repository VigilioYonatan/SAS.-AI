import {
    number,
    string,
    type Input,
    nullable,
    boolean,
    object,
} from "@vigilio/valibot";
export const noteResponseSunat = object({
    cdrResponse: object({ code: number(), description: string() }),
    error: object({ code: string(), message: string() }),
});
export type NoteResponseSunat = Input<typeof noteResponseSunat>;

export const notesSchema = object({
    id: number(),
    serie: string(),
    correlativo: string(),
    kind_invoice_code: string(),
    document_code: string(),
    identification_number: string(),
    razon_social: string(),
    send_sunat: boolean(),
    response_sunat: nullable(noteResponseSunat),
    xml_path: nullable(string()),
    cdr_path: nullable(string()),
    invoice_id: number(),
    kind_credit_notes_code: nullable(string()),
    kind_debit_notes_code: nullable(string()),
    order_id: number(),
    empresa_id: number(),
});

export type NotesSchema = Input<typeof notesSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
