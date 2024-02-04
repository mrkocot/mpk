export class Paragraph {
    constructor(id: string, header: string, body: string | null) {
        this.id = id;
        this.header = header;
        this.body = body;
    }

    id: string;
    header: string;
    body: string | null;
}
