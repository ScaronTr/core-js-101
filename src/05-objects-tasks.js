/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor(callStack = [], resultsArr = []) {
    this.callStack = callStack;
    this.resultsArr = resultsArr;
  }

  element(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item <= 6);
    if (checkCallStack === 6) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (checkCallStack < 6) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(value);
      callStack.push(6);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  id(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item <= 5);
    if (checkCallStack === 5) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (checkCallStack < 5) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(`#${value}`);
      callStack.push(5);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  class(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item < 4);
    if (checkCallStack < 4) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(`.${value}`);
      callStack.push(4);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  attr(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item < 3);
    if (checkCallStack < 3) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(`[${value}]`);
      callStack.push(3);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  pseudoClass(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item < 2);
    if (checkCallStack < 2) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(`:${value}`);
      callStack.push(2);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  pseudoElement(value) {
    const callStack = this.callStack.slice();
    const resultsArr = this.resultsArr.slice();

    const checkCallStack = callStack.find((item) => item <= 1);
    if (checkCallStack === 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (checkCallStack < 1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      resultsArr.push(`::${value}`);
      callStack.push(1);
      return new CssSelectorBuilder(callStack, resultsArr);
    }
  }

  combine(selector1, combinator, selector2) {
    const resultsArr = this.resultsArr.slice();
    resultsArr.push(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
    return new CssSelectorBuilder([], resultsArr);
  }

  stringify() {
    const string = this.resultsArr.join('');
    return string;
  }
}

const cssSelectorBuilder = new CssSelectorBuilder();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
