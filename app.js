class WorkoutTracker {
    static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];
        this.currentDate = new Date().toISOString().split('T')[0]; 

        this.loadEntries();
        this.updateView();

        this.root.querySelector(".tracker__add").addEventListener("click", () => {
            this.addEntry({
                date: this.currentDate,
                workout: "walking",
                duration: 30,
                water: 0,
                calories: 0,
                carbohydrates: 0
            });
        });

        this.root.querySelector(".bmi__calculate").addEventListener("click", () => {
            const weight = parseFloat(this.root.querySelector(".bmi__weight").value);
            const heightCm = parseFloat(this.root.querySelector(".bmi__height").value);
            if (weight > 0 && heightCm > 0) {
                const heightM = heightCm / 100;
                const bmi = (weight / (heightM * heightM)).toFixed(2);
                this.root.querySelector(".bmi__result").textContent = `Your BMI is ${bmi}`;
            } else {
                this.root.querySelector(".bmi__result").textContent = `Please enter valid weight and height.`;
            }
        });

        this.root.querySelector(".calendar__date").addEventListener("change", (e) => {
            this.currentDate = e.target.value;
            this.updateView();
        });

        this.root.querySelector(".summary__update").addEventListener("click", () => {
            this.updateSummary();
        });
    }

    static html() {
        return `
          <nav class="navbar">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#workout-tracker">Workout Tracker</a></li>
                <li><a href="#bmi-calculator">BMI Calculator</a></li>
                <li><a href="#summary">Summary</a></li>
            </ul>
        </nav>
            <table class="tracker">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Workout</th>
                        <th>Duration</th>
                        <th>Water (L)</th>
                        <th>Calories</th>
                        <th>Carbohydrates (g)</th>
                        <th>Update</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="tracker__entries"></tbody>
                <tbody>
                    <tr class="tracker__row tracker__row--add">
                        <td colspan="8">
                            <span class="tracker__add">Add Entry &plus;</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="bmi-calculator">
                <h3>BMI Calculator</h3>
                <input type="number" class="bmi__weight" placeholder="Weight (kg)" min="1">
                <input type="number" class="bmi__height" placeholder="Height (cm)" min="1">
                <button class="bmi__calculate">Calculate BMI</button>
                <p class="bmi__result"></p>
            </div>
            <div class="summary">
                <h3>Summary</h3>
                <input type="date" class="calendar__date" value="${new Date().toISOString().split('T')[0]}">
                <p class="summary__result"></p>
            </div>
        `;
    }

    static rowHtml() {
        return `
            <tr class="tracker__row">
                <td>
                    <input type="date" class="tracker__date">
                </td>
                <td>
                    <select class="tracker__workout">
                        <option value="walking">Walking</option>
                        <option value="running">Running</option>
                        <option value="outdoor-cycling">Outdoor Cycling</option>
                        <option value="indoor-cycling">Indoor Cycling</option>
                        <option value="swimming">Swimming</option>
                        <option value="yoga">Yoga</option>
                    </select>
                </td>
                <td class="tracker__duration-container">
                    <input type="number" class="tracker__duration" min="0">
                    <span class="tracker__text">minutes</span>
                </td>
                
                <td>
                    <input type="number" class="tracker__water" min="0">
                </td>
                <td>
                    <input type="number" class="tracker__calories" min="0">
                </td>
                <td>
                    <input type="number" class="tracker__carbohydrates" min="0">
                </td>
                <td>
                    <button type="button" class="tracker__button tracker__update">Update</button>
                </td>
                <td>
                    <button type="button" class="tracker__button tracker__delete">&times;</button>
                </td>
            </tr>
        `;
    }

    loadEntries() {
        this.entries = JSON.parse(localStorage.getItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY) || "[]");
    }

    saveEntries() {
        localStorage.setItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.entries));
    }

    updateView() {
        const tableBody = this.root.querySelector(".tracker__entries");
        const addRow = data => {
            const template = document.createElement("template");
            let row = null;

            template.innerHTML = WorkoutTracker.rowHtml().trim();
            row = template.content.firstElementChild;

            row.querySelector(".tracker__date").value = data.date;
            row.querySelector(".tracker__workout").value = data.workout;
            row.querySelector(".tracker__duration").value = data.duration;
            row.querySelector(".tracker__water").value = data.water;
            row.querySelector(".tracker__calories").value = data.calories;
            row.querySelector(".tracker__carbohydrates").value = data.carbohydrates;

            row.querySelector(".tracker__date").addEventListener("change", ({ target }) => {
                data.date = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__workout").addEventListener("change", ({ target }) => {
                data.workout = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__duration").addEventListener("change", ({ target }) => {
                data.duration = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__water").addEventListener("change", ({ target }) => {
                data.water = Math.max(0, parseFloat(target.value) || 0); 
                data.water = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__calories").addEventListener("change", ({ target }) => {
                data.calories = Math.max(0, target.value);
                data.calories = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__carbohydrates").addEventListener("change", ({ target }) => {
                data.carbohydrates = target.value;
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__update").addEventListener("click", () => {
                this.saveEntries();
                this.updateSummary();
            });

            row.querySelector(".tracker__delete").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            tableBody.appendChild(row);
        };

        tableBody.querySelectorAll(".tracker__row").forEach(row => {
            row.remove();
        });

        this.entries.forEach(data => {
            if (data.date === this.currentDate) {
                addRow(data);
            }
        });

        this.updateSummary();
    }

    addEntry(data) {
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }

    deleteEntry(dataToDelete) {
        this.entries = this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }

    updateSummary() {
        const summaryResult = this.root.querySelector(".summary__result");
        const entriesForDate = this.entries.filter(entry => entry.date === this.currentDate);

        const total = entriesForDate.reduce((acc, entry) => {
            return {
                water: acc.water + parseFloat(entry.water || 0),
                calories: acc.calories + parseFloat(entry.calories || 0),
                carbohydrates: acc.carbohydrates + parseFloat(entry.carbohydrates || 0),
            };
        }, { water: 0, calories: 0, carbohydrates: 0 });

        summaryResult.innerHTML = `
            <strong>Date:</strong> ${this.currentDate}<br>
            <strong>Total Water:</strong> ${total.water} L<br>
            <strong>Total Calories:</strong> ${total.calories}<br>
            <strong>Total Carbohydrates:</strong> ${total.carbohydrates} g
        `;
    }
}

const app = document.getElementById("app");
const wt = new WorkoutTracker(app);
window.wt = wt;