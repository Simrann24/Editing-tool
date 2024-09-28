class WorkoutTracker {

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
    
      
        this.root.querySelector(".bmi__calculate").addEventListener("click", () => {
            const weight = parseFloat(this.root.querySelector(".bmi__weight").value);
            const heightCm = parseFloat(this.root.querySelector(".bmi__height").value);
            const messageElement = this.root.querySelector(".bmi__message"); 

            if (weight > 0 && heightCm > 0) {
                const heightM = heightCm / 100;
                const bmi = (weight / (heightM * heightM)).toFixed(2);
                this.root.querySelector(".bmi__result").textContent = `Your BMI is ${bmi}`;

                let message = '';
                if (bmi < 18.5) {
                    message = "You are underweight. A balanced diet and strength training can help you gain healthy weight!";
                } else if (bmi >= 18.5 && bmi < 24.9) {
                    message = "Great job! You have a healthy BMI. Keep up the good work with regular exercise and a nutritious diet.";
                } else if (bmi >= 25 && bmi < 29.9) {
                    message = "You are in the overweight range. Consider working towards a balanced routine of diet and exercise.";
                } else {
                    message = "You are in the obese range. Consulting a healthcare provider for guidance can help you achieve a healthier lifestyle.";
                }

                messageElement.textContent = message; 
                messageElement.style.fontWeight = "bold";
            } else {
                this.root.querySelector(".bmi__result").textContent = `Please enter valid weight and height.`;
                messageElement.textContent = ""; 
            }
        });
    }

    static html() {
        return `
          <nav class="navbar">
            <ul>
                <li><a href="./home.html">Home</a></li>
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
                <p class="bmi__message"></p>
                
            </div>
           
        `;
    }


}

const app = document.getElementById("app");
const wt = new WorkoutTracker(app);
window.wt = wt;