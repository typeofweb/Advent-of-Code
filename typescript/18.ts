type NestedArray<T> = T | Array<NestedArray<T>>;

class Leaf<T = number> {
  constructor(public value: T, public parent: BinaryTree<T>) {}
  toJSON() {
    return this.value;
  }

  toString() {
    return String(this.value);
  }
}

class BinaryTree<T = number> {
  static mergeTrees<T>(
    l: Leaf<T> | BinaryTree<T>,
    r: Leaf<T> | BinaryTree<T>,
  ): BinaryTree<T> {
    const newTree = new BinaryTree<T>();
    newTree.left = l;
    newTree.right = r;
    l.parent = newTree;
    r.parent = newTree;

    return newTree;
  }

  static fromArray<T>(
    data: NestedArray<T>,
    parent?: BinaryTree<T>,
  ): Leaf<T> | BinaryTree<T> {
    if (Array.isArray(data)) {
      return BinaryTree.mergeTrees(
        BinaryTree.fromArray(data[0]),
        BinaryTree.fromArray(data[1]),
      );
    } else {
      if (parent) {
        return new Leaf(data, parent);
      } else {
        return new Leaf(data, null as any);
      }
    }
  }

  toJSON(): object {
    return {
      l: this.left?.toJSON(),
      r: this.right?.toJSON(),
    };
  }

  toString(): string {
    return `[${this.left?.toString()},${this.right?.toString()}]`;
  }

  constructor(left?: T, right?: T) {
    this.left = left == null ? undefined : new Leaf(left, this);
    this.right = right == null ? undefined : new Leaf(right, this);
  }

  parent?: BinaryTree<T> | undefined;

  left?: Leaf<T> | BinaryTree<T> | undefined;

  right?: Leaf<T> | BinaryTree<T> | undefined;
}

(() => {
  type Pair = readonly [number, number];
  type Pairs = readonly [Pair | Pairs | number, Pair | Pairs | number];

  const splitNum = (num: number): Pair => [
    Math.floor(num / 2),
    Math.ceil(num / 2),
  ];

  const concat = (lhs: Pairs, rhs: Pairs) => [lhs, rhs] as const;

  const sum = (list: readonly Pairs[]): Pairs => {
    return list.reduce((lhs, rhs) => concat(lhs, rhs));
  };

  const tree = BinaryTree.fromArray([[6, [5, [4, [3, 2]]]], 1]);

  const BREAK = Symbol('BREAK');

  function bfs(
    tree: BinaryTree | Leaf,
    cb: (
      b: BinaryTree,
      l: number,
      leftLevel: number,
      rightLevel: number,
    ) => void | typeof BREAK,
    level = 1,
    leftLevel = 0,
    rightLevel = 0,
  ): true | void {
    if (tree instanceof BinaryTree) {
      const r = cb(tree, level, leftLevel, rightLevel);
      if (r === BREAK) {
        return true;
      }
      return (
        (() => {
          if (tree.left) {
            if (tree.left instanceof BinaryTree) {
              return bfs(tree.left, cb, level + 1, leftLevel + 1, rightLevel);
            }
          }
        })() ||
        (() => {
          if (tree.right) {
            if (tree.right instanceof BinaryTree) {
              return bfs(tree.right, cb, level + 1, leftLevel, rightLevel + 1);
            }
          }
        })()
      );
    }
  }

  const explode = (tree: BinaryTree) =>
    bfs(tree, (tree, level, leftLevel, rightLevel) => {
      if (tree.left instanceof Leaf && tree.left.value >= 10) {
        const v = tree.left.value;
        const [l, r] = splitNum(v);
        tree.left = new BinaryTree(l, r);
        return BREAK;
      }
      if (tree.right instanceof Leaf && tree.right.value >= 10) {
        const v = tree.right.value;
        const [l, r] = splitNum(v);
        tree.right = new BinaryTree(l, r);
        return BREAK;
      }
      if (level === 5 && tree.parent) {
        let foundLeft = false;
        if (tree.left instanceof Leaf) {
          let node = tree as BinaryTree | undefined;
          while ((node = node?.parent)) {
            if (node.left instanceof Leaf) {
              node.left = new Leaf(tree.left.value + node.left.value, node);
              foundLeft = true;
              break;
            }
          }
          if (!foundLeft) {
            tree.parent.left = new Leaf(0, tree.parent);
          }
        }

        let foundRight = false;
        if (tree.right instanceof Leaf) {
          let node = tree as BinaryTree | undefined;
          while (true) {
            if (!node?.parent) {
              break;
            }
            node = node.parent;
            if (node.right instanceof Leaf) {
              node.right = new Leaf(tree.right.value + node.right.value, node);
              foundRight = true;
              break;
            }
          }
          if (!foundRight && leftLevel > 0) {
            node = node?.right as BinaryTree | undefined;
            while (true) {
              if (!node?.left) {
                break;
              }
              if (node.left instanceof Leaf) {
                node.left = new Leaf(tree.right.value + node.left.value, node);
                foundRight = true;
                break;
              }
              node = node?.left;
            }
          }
          if (!foundRight) {
            tree.parent.right = new Leaf(0, tree.parent);
          }
        }
        if (foundLeft && foundRight) {
          tree.parent.right = new Leaf(0, tree.parent);
        }
        return BREAK;
      }
    });

  // const cases = [
  //   [`[[[[[9,8],1],2],3],4]`, `[[[[0,9],2],3],4]`],
  //   [`[7,[6,[5,[4,[3,2]]]]]`, `[7,[6,[5,[7,0]]]]`],
  //   [`[[6,[5,[4,[3,2]]]],1]`, `[[6,[5,[7,0]]],3]`],
  //   [
  //     `[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]`,
  //     `[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]`,
  //   ],
  //   [`[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]`, `[[3,[2,[8,0]]],[9,[5,[7,0]]]]`],
  // ] as Array<[input: string, output: string]>;

  // const rs = cases.map(([input, output]) => {
  //   const tree = BinaryTree.fromArray(JSON.parse(input));
  //   // console.log(JSON.stringify(tree.toJSON(), null, 2));
  //   // while (explode(tree));
  //   explode(tree);
  //   const str = tree.toString();
  //   const result = str === output;

  //   return [result, input, ' -> ', str, ' == ', output];
  // });

  // console.log(rs);

  const tree2 = BinaryTree.fromArray(
    JSON.parse(`[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]`),
  );
  do {
    console.log(tree2.toString());
  } while (explode(tree2));
})();
