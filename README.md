# MMM-Sensibo: MagicMirror Module for Sensibo Thermostats

**MMM-Sensibo** is a [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) module that integrates with the Sensibo API to display a list of your Sensibo thermostats. Each thermostat displays the room name and target temperature, with a Font Awesome icon for easy recognition.

## Example Screenshot

<img width="261" alt="image" src="https://github.com/user-attachments/assets/437a5e70-85ce-45af-9fcc-f17ce7e5de38">

## Key Features

- **Real-Time Thermostat Data**: Fetches and displays the current target temperature, fan level, mode, and room name for each thermostat linked to your Sensibo account.
- **View Toggle (Grid/List)**: Switch between a grid or list view directly on the MagicMirror interface. You can set the default view in the module’s configuration.
- **Customizable Icons**: Specify custom Font Awesome icons for different room types in the configuration, or fall back to the default icons if none are provided.
- **Dual Temperature Display**: Choose to display temperatures in Fahrenheit, Celsius, or both (dual mode), allowing users to view readings in their preferred unit.

## Installation

1. Clone this repository into your `MagicMirror/modules` folder:

   ```bash
   cd ~/MagicMirror/modules
   git clone https://github.com/wlans/MMM-Sensibo
   cd MMM-Sensibo
   npm install
   ```

   This command installs Font Awesome and any other necessary dependencies.

2. Add the module to your MagicMirror `config.js` file:

   ```javascript
   {
       module: "MMM-Sensibo",
       position: "top_right", // Choose your preferred position
       config: {
           apiKey: "YOUR_SENSIBO_API_KEY", // Replace with your Sensibo API key
           view: "list",                   // Default view, can be "list" or "grid"
           temperatureUnit: "dual",        // Options: "F", "C", "dual" to show both Fahrenheit and Celsius
           roomIcons: {                    // Optional custom icons for room types
               Kitchen: "fa-blender",
               Garage: "fa-car",
               Office: "fa-laptop-house",
               Gym: "fa-heartbeat",
               Garden: "fa-leaf"
           }
       }
   },
   ```

## Configuration Options

| Option             | Description                                                                 | Default       |
|--------------------|-----------------------------------------------------------------------------|---------------|
| `apiKey`           | **Required** Your Sensibo API key.                                          | `""`          |
| `updateInterval`   | Interval (in milliseconds) between data refreshes.                          | `600000` (10 minutes) |
| `view`             | Display mode for thermostats: `"grid"` or `"list"`.                         | `"list"`      |
| `temperatureUnit`  | Temperature unit for display: `"F"` (Fahrenheit), `"C"` (Celsius), or `"dual"` (both). | `"F"` |
| `roomIcons`        | Object mapping room types to Font Awesome icon classes. See example above.  | `{}`          |

## Usage

- **View Toggle**: A toggle button allows you to easily switch between list and grid views on the fly.
- **Customizable Icons**: Use the `roomIcons` configuration to define specific Font Awesome icons for room types. Icons are assigned based on room names such as "Kitchen," "Office," or "Gym."
- **Dual Temperature Display**: Set `temperatureUnit` to `"dual"` to display both Fahrenheit and Celsius side-by-side for target and current temperatures. Choose `"F"` or `"C"` to display a single unit.
- **Customizable Styling**: The Font Awesome icons and layout styles are easy to customize through CSS. Custom styles can be added in the `MMM-Sensibo.css` file.

## Dependencies

- [@fortawesome/fontawesome-free](https://fontawesome.com) for Font Awesome icons.

## Contributing

Feel free to submit pull requests for new features, bug fixes, or improvements to the UI.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
