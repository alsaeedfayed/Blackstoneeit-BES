export interface INode {
  id: number;
  name: string;
  arabicName: string;
  nameAr: string;
  cssClass: string;
  code: string;
  children: INode[];
  level: number;
  Level: any;
  options?: any;
  parent?: Node;
  title: string;
}

export class Node implements INode {
  id: number;
  name: string;
  arabicName: string;
  nameAr: string;
  cssClass: string;
  code: string;
  children: INode[];
  level: number;
  Level: any;
  options?: any;
  parent?: Node;
  title: string;

  constructor(structure: string[], parent?: Node) {
    this.parent = parent;
    const [name, ...reports] = structure;
    this.name = name.split('(')[0].trim();
    const titleMatch = name.match(/\(([^)]+)\)/);
    this.title = titleMatch && titleMatch[1].trim();

    this.children = reports
      .map((r) => r.substring(1))
      .reduce((previous, current) => {
        if (!current.startsWith(' ')) {
          previous.push([]);
        }

        previous[previous.length - 1].push(current);
        return previous;
      }, [] as string[][])
      .map((r) => new Node(r, this));
  }
}
