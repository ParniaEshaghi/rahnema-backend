# بازی اسم و فامیل

# کلاس بازیکن‌ها
class Player:
    def __init__(self, name):
        self.name = name
        self.answers = {}
        self.score = 0
        
    def set_answers(self, letter, answers):
        self.answers[letter] = answers
        
    def add_points(self, points):
        self.score += points
        
    def get_answers(self, letter):
        return self.answers[letter]

# کلاس هر مرحله    
class Round:
    def __init__(self, letter, categories, players):
        self.letter = letter
        self.category_count = len(categories)
        self.players = players
        
    def calculate_points(self):
        points = {player.name: 0 for player in self.players}
        
        for i in range(self.category_count):
            answers = {}
            for player in self.players:
                answer = player.get_answers(self.letter)[i].lower()
                if answer.startswith(self.letter.lower()):
                    if answer not in answers:
                        answers[answer] = []
                    answers[answer].append(player.name)
            
            for answer, players in answers.items():
                if len(players) == 1:
                    points[players[0]] += 10
                else:
                    for player in players:
                        points[player] += 5
        
        for player in self.players:
            player.add_points(points[player.name])
        
        

# کلاس بازی
class Game:
    def __init__(self):
        self.players = []
        self.categories = []
    
    def add_player(self, name):
        player = Player(name)
        self.players.append(player)
        
    def add_category(self, category):
        self.categories.append(category)
    
    def get_players(self):
        return self.players
    
    def get_categories(self):
        return self.categories

        
        
        
        
def main():
    
    game = Game()
    
    print("\nBe bazi esm o famil khosh omadid!")  
       
    player_count = int(input("\nChand nafar bazi mikonid? "))
    print("Esmhaye baziconha ro vared konid.")   
    for i in range(player_count):
        name = input(f"Bazicon {i + 1}: ")
        game.add_player(name)
    
    category_count = int(input("\nChand sotoon bazi mikhaid? ")) 
    print("Sotoonha ro vared konid.")
    for i in range(category_count):
        category = input(f"Sotoon {i + 1}: ")
        game.add_category(category)
    
    # حلقه بازی    
    while True:
        letter = input("\nHarf ro vared konid (baraye khateme kalame 'payan' ro vared konid): ").lower()
        if letter == 'payan':
            break

        players = game.get_players()
        categories = game.get_categories()

        for player in players:
            print(f"\nPasokh haye {player.name}: ")
            answers = []
            for category in categories:
                answers.append(input(f"{category}: "))
            player.set_answers(letter, answers)
        
        current_round = Round(letter, categories, players)
        current_round.calculate_points()
        
        print("\nEmtiaz haye hame bazikonha: ")
        for player in players:
            print(f"{player.name}: {player.score} emtiaz")
    
    print("\nBazi be payan resid. Emtiaz haye nahayi: ")
    for player in players:
        print(f"{player.name}: {player.score} emtiaz")
    



if __name__ == "__main__":
    main()