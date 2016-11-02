import {assert} from "chai";

import {map, mapTo} from "../src/functor";
import {Applicative, lift, applicative} from "../src/applicative";

describe("applicative", () => {
  describe("deriving", () => {
    @applicative
    class Container<A> implements Applicative<A> {
      constructor(private val: A) {};
      of<B>(b: B): Container<B> {
        return new Container(b);
      }
      ap<B>(a: Container<(a: A) => B>): Container<B> {
        return new Container(a.val(this.val));
      }
      map: <B>(f: (a: A) => B) => Container<B>;
      mapTo: <B>(b: B) => Container<B>;
      lift: <R>(...args: any[]) => Container<R>;
    }
    const c = <A>(c: A) => new Container(c);
    it("can't derive when `of` is missing", () => {
      assert.throws(() => {
        @applicative
        class NotAnApplicative {
          constructor() {};
        }
      });
    });
    it("can't derive when `lift` and `ap` are missing", () => {
      assert.throws(() => {
        @applicative
        class NotAnApplicative<A> {
          constructor(private val: A) {};
          of<B>(b: B): Container<B> {
            return new Container(b);
          }
        }      
      });
    });
    it("is functor", () => {
      assert.deepEqual(map((n) => n * 2, c(7)), c(14));
      assert.deepEqual(mapTo(12, c(3)), c(12));
    });
    it("has lift function", () => {
      assert.deepEqual(lift((n) => n * 2, c(7)), c(14));
      assert.deepEqual(
        lift((n, m) => n + m, c(1), c(2)),
        c(3)
      );
      assert.deepEqual(
        lift((n, m, o) => n + m + o, c(1), c(2), c(4)),
        c(7)
      );
    })
  });
});
