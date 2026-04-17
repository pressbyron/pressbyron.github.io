with open('game.js', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "function generateChallenge" in line:
        skip = True
    if "function updateUI" in line:
        skip = False
    
    if not skip:
        new_lines.append(line)

with open('game.js', 'w') as f:
    f.writelines(new_lines)
