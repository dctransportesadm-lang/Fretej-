# AI Rules & Tech Stack - FretaJá

## Tech Stack
- **React 19**: Core frontend framework for building the user interface.
- **TypeScript**: Ensures type safety and improves code maintainability.
- **Tailwind CSS 4**: Utility-first CSS framework for all styling and responsive design.
- **Vite**: Fast build tool and development server.
- **Lucide React**: Standard library for all application icons.
- **Recharts**: Used for data visualization and financial analytics charts.
- **Date-fns**: Primary library for date manipulation, filtering, and formatting.
- **Motion**: Animation library for smooth transitions and interactive UI elements.
- **Express**: Backend server handling Google OAuth and API endpoints.

## Library Usage Rules
- **Styling**: Use Tailwind CSS utility classes exclusively. Avoid custom CSS files or inline styles.
- **Icons**: Always use `lucide-react`. Do not install or use other icon sets.
- **Data Visualization**: Use `recharts` for any graphs or statistical displays.
- **Date Handling**: Use `date-fns` for all date-related logic (e.g., `isSameDay`, `format`).
- **Animations**: Use `motion` (from the `motion` package) for page transitions and component animations.
- **UI Components**: Follow the Shadcn/UI pattern. Keep base components in `src/components/ui/` and feature components in `src/components/`.
- **State Management**: Use React Context for global state (Auth, Theme) and custom hooks for data persistence (LocalStorage).
- **API Communication**: Use the native `fetch` API for server requests.