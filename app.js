class WorkoutTracker {
    static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];
        this.currentDate = new Date().toISOString().split('T')[0]; 

        this.loadEntries();
       
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

      
    }

    static html() {
        return `
          <nav class="navbar">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="./table.html">Workout Tracker</a></li>
                <li><a href="#bmi-calculator">BMI Calculator</a></li>
                <li><a href="#summary">Summary</a></li>
            </ul>
        </nav>

       
        
            
            <div class="bmi-calculator">

                <h3>BMI Calculator</h3>
                <input type="number" class="bmi__weight" placeholder="Weight (kg)" min="1">
                <input type="number" class="bmi__height" placeholder="Height (cm)" min="1">
                <button class="bmi__calculate">Calculate BMI</button>
                <p class="bmi__result"></p>
                
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

   
    
}

const app = document.getElementById("app");
const wt = new WorkoutTracker(app);
window.wt = wt;