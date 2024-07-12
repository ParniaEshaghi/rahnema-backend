
def c1(halghe: str) -> int:
    count = 0
    colors = {"R","G","B"}
    hcount = len(halghe)
    for i in range(10):
        icolors = set()
        for j in range(1, hcount, 2):
            if int(halghe[j]) == i:
                icolors.add(halghe[j-1])
        if colors == icolors:
            count += 1
    return count
                

halghe = input()
print(c1(halghe))