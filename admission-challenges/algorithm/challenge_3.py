from typing import Optional
import re

# Definition for a binary tree node.
class Node:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

   
def recover(traversal: str, d: int = 0) -> Optional[Node]:
    split = re.split("(?<!-)-{"+ str(d+1) +"}(?!-)", str(traversal))
    if len(split) == 1:
        return Node(split[0])
    dval = split[0]
    dleft = None
    dright = None
    if len(split) >= 2:
        dleft = split[1]
    if len(split) >= 3:
        dright = split[2]
    tree = Node(val=dval, left=recover(dleft, d + 1), right=recover(dright, d + 1))
    return tree

# level order traversal used from GeeksforGeeks website
def level_order_list(root: Optional[Node]) -> list:
    queue = []
    queue.append(root)
    level_order = []
    while(len(queue) > 0):
        
        level_order.append(queue[0].val)
        node = queue.pop(0)
        
        if node.left is not None:
            queue.append(node.left)

        if node.right is not None:
            queue.append(node.right)
            
    return level_order



traversal = input()
recoverred_tree = recover(traversal)
print(level_order_list(recoverred_tree))
