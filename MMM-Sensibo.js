/* MagicMirror Module: MMM-Sensibo
 * By Wyatt
 * MIT Licensed
 */

Module.register("MMM-Sensibo", {
    defaults: {
        apiKey: "",
        updateInterval: 10 * 60 * 1000, // Update every 10 minutes
        view: "list", // "list" or "grid"
        roomIcons: {}, // Custom icons can be specified here
        temperatureUnit: "F" // Options: "F", "C", "dual"
    },

    start: function () {
        this.thermostats = [];
        this.sendSocketNotification("FETCH_SENSIBO_DATA", { apiKey: this.config.apiKey });
        this.scheduleUpdate();
    },

    getStyles: function () {
        return ["MMM-Sensibo.css", "modules/MMM-Sensibo/node_modules/@fortawesome/fontawesome-free/css/all.min.css"];
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.sendSocketNotification("FETCH_SENSIBO_DATA", { apiKey: this.config.apiKey });
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SENSIBO_DATA") {
            this.thermostats = payload;
            this.updateDom();
        }
    },

    getIconClass: function (roomType) {
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

    getDom: function () {
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
            icon.className = `fas ${this.getIconClass(thermostat.room.icon)}`;
            item.appendChild(icon);

            // Room name container
            const nameContainer = document.createElement("div");
            nameContainer.className = "thermostat-room-name";
            const roomName = document.createElement("span");
            roomName.className = "room-name";
            roomName.innerHTML = thermostat.room.name;
            nameContainer.appendChild(roomName);
            item.appendChild(nameContainer);

            // Status container for temperatures, mode, and fan level
            const statusContainer = document.createElement("div");
            statusContainer.className = "thermostat-status";
            const { targetTemperature, mode, fanLevel, on } = thermostat.acState;

            // Handle target temperature display
            const targetTempF = targetTemperature;
            const targetTempC = Math.round((targetTemperature - 32) * (5 / 9));
            const targetTempDisplay = this.config.temperatureUnit === "dual" ?
                `${targetTempF}°F / ${targetTempC}°C` :
                `${this.config.temperatureUnit === "C" ? targetTempC : targetTempF}°${this.config.temperatureUnit}`;

            // Handle current temperature display (API returns in Celsius)
            const currentTempCelsius = thermostat.measurements?.temperature;
            const currentTempFahrenheit = currentTempCelsius !== undefined ? Math.round((currentTempCelsius * 9 / 5) + 32) : undefined;
            const currentTempDisplay = currentTempCelsius !== undefined ? (
                this.config.temperatureUnit === "dual" ?
                    `${currentTempFahrenheit}°F / ${currentTempCelsius}°C` :
                    `${this.config.temperatureUnit === "C" ? currentTempCelsius : currentTempFahrenheit}°${this.config.temperatureUnit}`
            ) : "";

            const stateText = on ? `${mode} - Target: ${targetTempDisplay} - Fan: ${fanLevel}` : "Off";
            const tempText = currentTempDisplay ? `Current: ${currentTempDisplay}` : "";

            // Combine text and append to DOM
            statusContainer.innerHTML = `${stateText} ${tempText}`;
            item.appendChild(statusContainer);

            wrapper.appendChild(item);
        });

        return wrapper;
    }

});
