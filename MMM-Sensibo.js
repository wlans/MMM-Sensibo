/* MagicMirror Module: MMM-Sensibo
 * By Wyatt
 * MIT Licensed
 */

Module.register("MMM-Sensibo", {
    defaults: {
        apiKey: "",
        updateInterval: 2 * 60 * 1000, // Update every 2 minutes
        view: "list", // "list" or "grid"
        roomIcons: {}, // Custom icons can be specified here
        temperatureUnit: "F" // Options: "F", "C", "dual"
    },

    start () {
        this.thermostats = [];
        this.sendSocketNotification("FETCH_SENSIBO_DATA", { apiKey: this.config.apiKey });
        this.scheduleUpdate();
    },

    getStyles () {
        return ["MMM-Sensibo.css", "modules/MMM-Sensibo/node_modules/@fortawesome/fontawesome-free/css/all.min.css"];
    },

    scheduleUpdate () {
        setInterval(() => {
            this.sendSocketNotification("FETCH_SENSIBO_DATA", { apiKey: this.config.apiKey });
        }, this.config.updateInterval);
    },

    socketNotificationReceived (notification, payload) {
        if (notification === "SENSIBO_DATA") {
            this.thermostats = payload;
            this.updateDom();
        }
    },

    getIconClass (roomType) {
        // Default icons mapping
        const defaultIcons = {
            Office: "fa-briefcase",
            Bedroom: "fa-bed",
            Kitchen: "fa-utensils",
            Kidsroom: "fa-child",
            Diningroom: "fa-chair",
            Livingroom: "fa-couch",
            Bathroom: "fa-bath",
            Garage: "fa-warehouse",
            Basement: "fa-house-damage",
            Attic: "fa-home",
            Laundryroom: "fa-tshirt",
            Gym: "fa-dumbbell",
            Study: "fa-book",
            Hallway: "fa-door-open",
            Storage: "fa-box",
            Patio: "fa-tree",
            Balcony: "fa-tree",
            GameRoom: "fa-gamepad",
            Theater: "fa-film",
            Garden: "fa-seedling"
        };

        // Use custom icon from config if provided, otherwise fall back to default icon
        return this.config.roomIcons[roomType] || defaultIcons[roomType] || "fa-thermometer-half";
    },

    getDom () {
        const wrapper = document.createElement("div");
        wrapper.className = `sensibo-thermostats ${this.config.view}`;

        if (this.thermostats.length === 0) {
            wrapper.innerHTML = "Loading thermostats...";
            return wrapper;
        }

        this.thermostats.forEach((thermostat) => {
            const item = document.createElement("div");
            item.className = "thermostat-item";

            // Icon based on room type
            const icon = document.createElement("i");
            icon.className = `fas ${this.getIconClass(thermostat.room.icon)} small-icon`; // Add class for smaller icons
            item.appendChild(icon);

            // Room name container
            const nameContainer = document.createElement("div");
            nameContainer.className = "thermostat-room-name";
            const roomName = document.createElement("span");
            roomName.className = "room-name";
            roomName.innerHTML = thermostat.room.name;
            nameContainer.appendChild(roomName);
            item.appendChild(nameContainer);

            // Status container for temperatures, mode, fan level, and humidity
            const statusContainer = document.createElement("div");
            statusContainer.className = "thermostat-status";
            const { targetTemperature, mode, fanLevel, on } = thermostat.acState;

            // Handle target temperature and humidity display
            const targetTempF = targetTemperature;
            const targetTempC = Math.round((targetTemperature - 32) * (5 / 9));
            const targetTempDisplay = this.config.temperatureUnit === "dual" ?
                `${targetTempF}°F / ${targetTempC}°C` :
                `${this.config.temperatureUnit === "C" ? targetTempC : targetTempF}°${this.config.temperatureUnit}`;

            const currentTempCelsius = thermostat.measurements?.temperature;
            const currentTempFahrenheit = currentTempCelsius !== undefined ? Math.round((currentTempCelsius * 9 / 5) + 32) : undefined;
            const currentTempDisplay = currentTempCelsius !== undefined ? (
                this.config.temperatureUnit === "dual" ?
                    `${currentTempFahrenheit}°F / ${currentTempCelsius}°C` :
                    `${this.config.temperatureUnit === "C" ? currentTempCelsius : currentTempFahrenheit}°${this.config.temperatureUnit}`
            ) : "";

            const humidity = thermostat.measurements?.humidity;
            const humidityDisplay = humidity !== undefined ? `${humidity}%` : "N/A";

            // Combine temperature, humidity, and status text
            const stateText = on ? `${mode} - Target: ${targetTempDisplay} - Fan: ${fanLevel}` : "Off";

            // Temperature display with icon
            const tempContainer = document.createElement("div");
            tempContainer.className = "temperature";
            tempContainer.innerHTML = `<i class="fas fa-thermometer-half"></i> ${currentTempDisplay}`;
            statusContainer.appendChild(tempContainer);

            // Humidity display with icon
            const humidityContainer = document.createElement("div");
            humidityContainer.className = "humidity";
            humidityContainer.innerHTML = `<i class="fas fa-tint"></i> ${humidityDisplay}`;
            statusContainer.appendChild(humidityContainer);

            // Display state text
            const stateTextContainer = document.createElement("div");
            stateTextContainer.className = "state-text";
            stateTextContainer.innerHTML = `${stateText}`;
            statusContainer.appendChild(stateTextContainer);

            item.appendChild(statusContainer);
            wrapper.appendChild(item);
        });


        return wrapper;
    }

});
