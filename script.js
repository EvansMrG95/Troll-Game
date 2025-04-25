class Game {
  constructor() {
    this.inventory = new Set();
    this.distractedTrolls = new Set();
    this.approachedTrolls = new Set();

    this.trolls = {
      north: 'chicken drumstick',
      south: 'beef burger',
      east: 'salad',
      west: 'sandwich'
    };
    this.requiredTrollCount = Object.keys(this.trolls).length;
    this.gameOver = false;

    this.descriptions = {
      north: "The tide carried you to the north bridge. Broken ship timbers jut from the sand like grave markers. The wind is silent. You feel watched.",
      south: "You arrive at the southern bridge. The ground is warm. Ash clings to your boots. A low hum pulses from deep within the stone.",
      east: "A pale mist parts as you reach the eastern bridge. Glowing trees sway with no breeze, and soft humming echoes through the haze.",
      west: "Under a blood-red moon, you step onto the western bridge. Shells crunch beneath your feet, all pierced as if drained. Something stirs in the water."
    };
  }

  processCommand(command) {
    if (this.gameOver) {
      return "The game is over. Refresh or click 'Restart' to play again.";
    }

    command = command.toLowerCase().trim();

    if (command.startsWith("pick up ")) {
      const item = command.replace("pick up ", "").trim();
      this.inventory.add(item);
      return `You picked up a ${item}.`;

    } else if (command.startsWith("approach ")) {
      const match = command.match(/approach (north|south|east|west) bridge/);
      if (!match) return "Invalid approach command. Try 'approach north bridge'.";

      const direction = match[1];
      const requiredItem = this.trolls[direction];

      if (!this.inventory.has(requiredItem)) {
        return `You sense danger. You should find something to distract the troll before approaching the ${direction} bridge.`;
      }

      this.approachedTrolls.add(direction); 
      return this.descriptions[direction];

    } else if (command.startsWith("feed ")) {
      const match = command.match(/feed (north|south|east|west) troll/);
      if (!match) return "Invalid feed command. Try 'feed north troll'.";

      const direction = match[1];
      const requiredItem = this.trolls[direction];

      if (!this.approachedTrolls.has(direction)) {
        return `You haven't approached the ${direction} bridge yet. You don't even see the troll!`;
      }

      if (this.distractedTrolls.has(direction)) {
        this.gameOver = true;
        document.getElementById("restartButton").style.display = "inline-block";
        return `You already distracted the ${direction} troll! It catches you trying to trick it again. Game Over.`;
      }

      if (!this.inventory.has(requiredItem)) {
        this.gameOver = true;
        document.getElementById("restartButton").style.display = "inline-block";
        return `You tried to feed the ${direction} troll without a ${requiredItem}. The troll is not pleased. Game Over.`;
      }

      this.distractedTrolls.add(direction);
      this.inventory.delete(requiredItem);
      const capitalDir = direction.charAt(0).toUpperCase() + direction.slice(1);
      return `You have fed the ${direction} troll with a ${requiredItem}. It is distracted! (${this.distractedTrolls.size}/${this.requiredTrollCount})\nYou have passed the ${capitalDir} bridge safely.`;

    } else if (command === "escape the island") {
      if (this.distractedTrolls.size === this.requiredTrollCount) {
        this.gameOver = true;
        document.getElementById("restartButton").style.display = "inline-block";
        return "All trolls are distracted! You quickly escape the island whilst the trolls are tucking into their snacks!";
      } else {
        const remaining = this.requiredTrollCount - this.distractedTrolls.size;
        return `You can't escape yet. ${remaining} troll${remaining > 1 ? 's are' : ' is'} still guarding the bridge${remaining > 1 ? 's' : ''}!`;
      }

    } else {
      return "Unknown command. Try something like 'pick up beef burger', 'approach west bridge', or 'feed north troll'.";
    }
  }
}


const game = new Game();
const input = document.getElementById("commandInput");
const submitBtn = document.getElementById("submitCommand");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

submitBtn.addEventListener("click", handleCommand);
input.addEventListener("keypress", function (e) {
  if (e.key === 'Enter') handleCommand();
});

function handleCommand() {
  const command = input.value;
  const result = game.processCommand(command);
  message.textContent = result;
  input.value = '';
}

restartButton.addEventListener("click", () => {
  window.location.reload();
});