import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { JsonStructure, TestbedStructure, Testbed } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  constructor(private http: HttpClient) { }

  public previewJsonStructure(file: File): Observable<JsonStructure> {
    // since FileReader API is event-based, gotta wrap it in a promise
    // and then turn that promise into an observable
    const readPromise = new Promise<JsonStructure>((res, rej) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const { result } = reader;
        const structure = this.validateDataToStructure(result.toString());
        if (structure) {
          res(structure);
        } else {
          rej(`File format of ${file.name} is incorrect.`);
        }
      };
      reader.readAsText(file);
    });

    return from(readPromise);
  }

  public uploadJsonStructure(baseUrl: string, structure: JsonStructure): Observable<Testbed> {
    return this.http.post<Testbed>(baseUrl + '/item-structure', structure);
  }

  private validateDataToStructure(possibleStructure: string): JsonStructure | null {
    let parsedStructure: JsonStructure;

    try {
      parsedStructure = JSON.parse(possibleStructure);
    } catch {
      return null;
    }

    // * Validate statuses first
    // should be an array of strings
    if (!Array.isArray(parsedStructure.statuses)) {
      return null;
    }

    // make sure every element is an object
    const isValid = parsedStructure.statuses.every(val =>
      typeof val === 'object' &&
      typeof val.color === 'string' &&
      typeof val.status === 'string'
    );

    if (!isValid) {
      return null;
    }

    // * Then validate the data

    // Validate the testbed object first
    if (!this.isValidTestbed(parsedStructure.testbedStructure)) {
      return null;
    }

    // Our structure should contain a list of children.
    if (!parsedStructure.testbedStructure.items) {
      return null;
    }

    // Check each item to make sure it's valid.
    for (const item of parsedStructure.testbedStructure.items) {
      if (!this.isValidStructure(item)) {
        return null;
      }
    }

    return parsedStructure;
  }

  private isValidTestbed(possibleStructure: any): possibleStructure is TestbedStructure {
    if (
      typeof possibleStructure !== 'object' ||
      typeof possibleStructure.name !== 'string' ||
      typeof possibleStructure.acronym !== 'string'
    ) {
      return false;
    }

    return true;
  }

  private isValidStructure(possibleStructure: any): boolean {
    if (
      typeof possibleStructure !== 'object' ||
      typeof possibleStructure.name !== 'string' ||
      typeof possibleStructure.fullname !== 'string'
    ) {
      return false;
    }

    // recursively check children
    if (Array.isArray(possibleStructure.children) &&
      !possibleStructure.children.every(this.isValidStructure.bind(this))
    ) {
      return false;
    }

    return true;
  }
}
