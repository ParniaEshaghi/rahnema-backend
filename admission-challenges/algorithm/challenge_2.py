class Tarikhche:

    def __init__(self, homepage: str):
        self.history = [homepage]
        self.current_index = 0

    def visit(self, url: str) -> None:
        del self.history[self.current_index + 1: len(self.history)]
        self.history.append(url)
        self.current_index += 1
    
    def undo(self, steps: int) -> str:
        self.current_index = max(0, self.current_index - steps)
        print(self.history[self.current_index])

    def redo(self, steps: int) -> str:
        self.current_index = min(len(self.history) - 1, self.current_index + steps)
        print(self.history[self.current_index])


# Your Tarikhche object will be instantiated and called as such:
# obj = Tarikhche(homepage)
# obj.visit(url)
# param_2 = obj.undo(steps)
# param_3 = obj.redo(steps)

