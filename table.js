class WorkoutTracker {
    static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.entries = [];
        const today = new Date().toISOString().split('T')[0];
        this.currentDate = today;


        this.root.querySelector("#entry-date").value = today;
        this.root.querySelector("#summary-date").value = today;

        this.loadEntries();
        this.updateView();
        this.updateSummary();

     
        this.root.querySelector(".tracker__add").addEventListener("click", () => {
            const date = this.root.querySelector("#entry-date").value;
            const workout = this.root.querySelector("#entry-workout").value;
            const duration = parseInt(this.root.querySelector("#entry-duration").value) || 0;
            const water = parseFloat(this.root.querySelector("#entry-water").value) || 0;
            const calories = parseInt(this.root.querySelector("#entry-calories").value) || 0;
            const carbohydrates = parseInt(this.root.querySelector("#entry-carbohydrates").value) || 0;

            this.addEntry({
                date,
                workout,
                duration,
                water,
                calories,
                carbohydrates
            });

            this.root.querySelector("#entry-duration").value = 30;
            this.root.querySelector("#entry-water").value = 0;
            this.root.querySelector("#entry-calories").value = 0;
            this.root.querySelector("#entry-carbohydrates").value = 0;
        });

  
        this.root.querySelector("#summary-date").addEventListener("change", (e) => {
            this.currentDate = e.target.value;
            this.updateSummary();
        });
    }

    addEntry(entry) {
        this.entries.push(entry);
        this.saveEntries();
        this.updateView();
    }

    updateView() {
        const entriesContainer = this.root.querySelector(".tracker__entries");
        entriesContainer.innerHTML = ""; 

        this.entries.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.className = "tracker__row";

            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.workout}</td>
                <td>${entry.duration}</td>
                <td>${entry.water}</td>
                <td>${entry.calories}</td>
                <td>${entry.carbohydrates}</td>
                <td><button class="update-btn">Update</button></td>
                <td><button class="delete-btn">Delete</button></td>
            `;

      
            row.querySelector(".delete-btn").addEventListener("click", () => {
                this.deleteEntry(index);
            });

            

            entriesContainer.appendChild(row);
        });

        
        this.updateSummary();
    }

    updateSummary() {
        const summaryElement = this.root.querySelector(".summary__result");
        const selectedDate = this.currentDate;

      
        const filteredEntries = this.entries.filter(entry => entry.date === selectedDate);

      
        const totalWater = filteredEntries.reduce((sum, entry) => sum + entry.water, 0);
        const totalCalories = filteredEntries.reduce((sum, entry) => sum + entry.calories, 0);
        const totalCarbohydrates = filteredEntries.reduce((sum, entry) => sum + entry.carbohydrates, 0);
        const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
        const totalWorkouts = filteredEntries.length;

        if (filteredEntries.length > 0) {
            summaryElement.innerHTML = `
                <strong>Date:</strong> ${selectedDate}<br>
                <strong>Total Workouts:</strong> ${totalWorkouts}<br>
                <strong>Total Duration:</strong> ${totalDuration} mins<br>
                <strong>Total Water Intake:</strong> ${totalWater} L<br>
                <strong>Total Calories Burned:</strong> ${totalCalories} kcal<br>
                <strong>Total Carbohydrates Consumed:</strong> ${totalCarbohydrates} g
            `;
        } else {
            summaryElement.textContent = "No entries for the selected date.";
        }
    }

    deleteEntry(index) {
        if (confirm("Are you sure you want to delete this entry?")) {
            this.entries.splice(index, 1);
            this.saveEntries();
            this.updateView();
        }
    }

    loadEntries() {
        const data = localStorage.getItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY);
        if (data) {
            this.entries = JSON.parse(data);
        }
    }

    saveEntries() {
        localStorage.setItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.entries));
    }
}


new WorkoutTracker(document.getElementById("app"));