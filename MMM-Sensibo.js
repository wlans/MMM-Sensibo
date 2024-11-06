/* MagicMirror Module: MMM-Sensibo
 * By Wyatt
 * MIT Licensed
 */

Module.register("MMM-Sensibo", {
    defaults: {
        apiKey: "",
        updateInterval: 10 * 60 * 1000, // Update every 10 minutes
        view: "list", // "list" or "grid"
        roomIcons: {} // Custom icons can be specified here
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

            // Room name and target temperature
            const name = document.createElement("span");
            name.className = "thermostat-name";
            const { name: roomName, icon: roomIcon } = thermostat.room;
            const { targetTemperature, mode, fanLevel, on } = thermostat.acState;
            const stateText = on ? `${mode} - ${targetTemperature}°F - Fan: ${fanLevel}` : "Off";
            name.innerHTML = `${roomName} (${stateText})`;
            item.appendChild(name);

            wrapper.appendChild(item);
        });

        return wrapper;
    },
});
