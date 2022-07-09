interface SystemClass extends ISystem {}
class SystemClass {}

export interface ISystem {
  id: string;
  label: string;
}
export class System extends SystemClass {}
