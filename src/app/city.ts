export class City {
    constructor(id: string, name: string, country: string, editor: string) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.editor = editor;
    }

    id: string;
    name: string;
    country: string;
    editor: string;
}
