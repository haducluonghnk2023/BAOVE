def find_min_number(s):
    min_number = float('inf')
    current_number = ""
    for char in s:
        if char.isdigit():
            current_number += char
        elif current_number:
            min_number = min(min_number,int(current_number))
            current_number = ""

    if current_number:
        min_number = min(min_number, int(current_number))
    return min_number
X = "ab123234567gh345678sdfghj3456456cd"
min_number = find_min_number(X)
print(min_number)