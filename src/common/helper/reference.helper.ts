import * as referenceGenerator from 'random-string-generator';

export class ReferenceHelper {
  static generateModelReference(prefix) {
    return prefix + referenceGenerator(20, 'lower');
  }
}
