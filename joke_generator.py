import requests
import json

class JokeGenerator:
    """A random joke generator using the JokeAPI"""
    
    BASE_URL = "https://v2.jokeapi.dev/joke"
    
    def __init__(self):
        """Initialize the joke generator"""
        self.session = requests.Session()
    
    def get_random_joke(self, joke_type="Any", safe_mode=True):
        """
        Fetch a random joke from the API
        
        Args:
            joke_type (str): Type of joke - "Any", "General", "Programming", "Knock-Knock"
            safe_mode (bool): If True, returns only safe jokes
        
        Returns:
            dict: Joke data or error message
        """
        try:
            params = {
                "safe-mode": str(safe_mode).lower()
            }
            
            url = f"{self.BASE_URL}/{joke_type}"
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            return response.json()
        
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
    
    def format_joke(self, joke_data):
        """
        Format joke data for display
        
        Args:
            joke_data (dict): Joke data from API
        
        Returns:
            str: Formatted joke text
        """
        if "error" in joke_data:
            return f"❌ Error: {joke_data['error']}"
        
        if joke_data.get("type") == "single":
            return f"😂 {joke_data['joke']}"
        
        elif joke_data.get("type") == "twopart":
            setup = joke_data.get("setup", "")
            delivery = joke_data.get("delivery", "")
            return f"🎭 Setup: {setup}\n💡 Delivery: {delivery}"
        
        else:
            return "❓ Unknown joke format"
    
    def get_joke_by_category(self, category="Any"):
        """
        Get a joke from a specific category
        
        Categories: General, Programming, Knock-Knock, Dad, Spooky, Christmas
        
        Args:
            category (str): Joke category
        
        Returns:
            str: Formatted joke
        """
        joke_data = self.get_random_joke(joke_type=category)
        return self.format_joke(joke_data)
    
    def get_multiple_jokes(self, count=5, category="Any"):
        """
        Get multiple jokes
        
        Args:
            count (int): Number of jokes to fetch
            category (str): Joke category
        
        Returns:
            list: List of formatted jokes
        """
        jokes = []
        for _ in range(count):
            joke_data = self.get_random_joke(joke_type=category)
            formatted = self.format_joke(joke_data)
            jokes.append(formatted)
        
        return jokes


def main():
    """Main function to demonstrate the joke generator"""
    
    print("🎉 Welcome to the Random Joke Generator! 🎉\n")
    
    generator = JokeGenerator()
    
    # Get a random joke
    print("1️⃣  Random Joke:")
    joke = generator.get_random_joke()
    print(generator.format_joke(joke))
    print()
    
    # Get a programming joke
    print("2️⃣  Programming Joke:")
    programming_joke = generator.get_joke_by_category("Programming")
    print(programming_joke)
    print()
    
    # Get multiple jokes
    print("3️⃣  Multiple Jokes:")
    multiple = generator.get_multiple_jokes(count=3, category="General")
    for i, j in enumerate(multiple, 1):
        print(f"  {i}. {j}\n")


if __name__ == "__main__":
    main()
