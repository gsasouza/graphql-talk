export interface BaseEntry {
  id: string;
}

export class MemoryDatabase<T extends BaseEntry> {
  private _data: T[] = [];
  private _count = 0;

  insert(entry: T) {
    const newEntry = {
      ...entry,
      id: this._data.length.toString(),
      createdAt: new Date(),
    };
    this._data.push(newEntry);
    this._count += 1;
    return newEntry;
  }

  remove(id: BaseEntry["id"]) {
    this._data = this._data.filter((entry) => entry.id !== id);
    this._count = Math.min(this._count - 1, 0);
  }

  getAll(): T[] {
    return this._data;
  }

  getById(id: BaseEntry["id"]) {
    return this._data.find((entry) => entry.id === id);
  }

  clear() {
    this._data = [];
  }
}
