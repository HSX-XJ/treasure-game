// ========== 模拟宝藏地图 API ==========
class TreasureMap {
  static getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => resolve("📜 在古老的图书馆里找到了第一个线索..."), 1000);
    });
  }

  static decodeAncientScript(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) return reject("❌ 没有线索可以解码!");
        resolve("🔍 解码成功!宝藏在一座古老的神庙中...");
      }, 1500);
    });
  }

  // 新增：穿越迷雾森林
  static crossMistyForest(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const path = Math.random();
        if (path < 0.3) {
          reject("🌫️ 迷路了!在森林里绕了回来...");
        } else if (path < 0.7) {
          resolve("🌲 穿过森林，发现一条通往神庙的小径...");
        } else {
          resolve("🦌 遇到一只神鹿带路，快速穿过了森林!");
        }
      }, 1800);
    });
  }

  static searchTemple(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random();
        if (random < 0.5) {
          return reject("⚔️ 糟糕!遇到了神庙守卫!");
        }
        resolve("📦 找到了一个神秘的箱子...");
      }, 2000);
    });
  }

  // 新增：解谜
  static solveRiddle(box) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const answers = ["钥匙", "key", "金色钥匙"];
        const userAnswer = prompt("🧩 宝箱上写着:『我无口却能开万门，我无手却能启千锁。我是什么?』");
        if (userAnswer && answers.includes(userAnswer.trim().toLowerCase())) {
          resolve("✅ 谜题解开!宝箱发出金光...");
        } else {
          reject("❌ 答案错误，宝箱纹丝不动...");
        }
      }, 800);
    });
  }

  static openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => resolve("🎉 恭喜!你找到了传说中的宝藏!"), 1000);
    });
  }
}

// ========== 动画辅助函数 ==========
function log(message, type = "info") {
  const logEl = document.getElementById("log");
  if (!logEl) return console.log(message);
  const p = document.createElement("p");
  p.className = `log-item ${type}`;
  p.textContent = message;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

function updateProgress(step) {
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = `${step * 20}%`;
}

function showCharacter(emoji) {
  const hero = document.getElementById("hero");
  if (hero) {
    hero.textContent = emoji;
    hero.classList.remove("bounce");
    void hero.offsetWidth; // 触发重绘，让动画能重复播放
    hero.classList.add("bounce");
  }
}

// ========== 用 async/await 重写寻宝过程 ==========
async function findTreasure() {
  const btn = document.getElementById("start-btn");
  if (btn) btn.disabled = true;

  try {
    log("🚀 冒险开始...", "start");
    showCharacter("🧑‍🎓");
    updateProgress(0);

    // 1. 获取线索
    const clue = await TreasureMap.getInitialClue();
    log(clue, "success");
    updateProgress(1);
    showCharacter("📖");

    // 2. 解码
    const location = await TreasureMap.decodeAncientScript(clue);
    log(location, "success");
    updateProgress(2);

    // 3. 穿越森林（最多重试 3 次）
    let forestMsg;
    let forestAttempts = 0;
    while (forestAttempts < 3) {
      try {
        forestMsg = await TreasureMap.crossMistyForest(location);
        break;
      } catch (err) {
        forestAttempts++;
        log(`${err} (第 ${forestAttempts} 次尝试)`, "warn");
        if (forestAttempts >= 3) throw new Error("森林太迷，无法通过");
      }
    }
    log(forestMsg, "success");
    updateProgress(3);
    showCharacter("🌲");

    // 4. 搜索神庙（最多重试 3 次）
    let box;
    let attempts = 0;
    while (attempts < 3) {
      try {
        box = await TreasureMap.searchTemple(location);
        break;
      } catch (err) {
        attempts++;
        log(`${err} (第 ${attempts} 次尝试)`, "warn");
        if (attempts >= 3) throw new Error("守卫太强，撤退了");
      }
    }
    log(box, "success");
    updateProgress(4);
    showCharacter("🏛️");

    // 5. 解谜
    const riddleResult = await TreasureMap.solveRiddle(box);
    log(riddleResult, "success");

    // 6. 打开宝箱
    const treasure = await TreasureMap.openTreasureBox();
    log(treasure, "treasure");
    updateProgress(5);
    showCharacter("💎");

    log("🏆 冒险圆满结束!", "treasure");
  } catch (error) {
    log(`💀 任务失败: ${error}`, "error");
    showCharacter("😢");
  } finally {
    if (btn) btn.disabled = false;
  }
}