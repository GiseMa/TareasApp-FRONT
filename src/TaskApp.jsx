import { AuthProvider, TaskProvider, UIProvider } from "./context"
import {AppRouter} from "./router/AppRouter"

function TaskApp() {

  return (
    <AuthProvider>
      <UIProvider>
        <TaskProvider>
          <AppRouter/>
        </TaskProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default TaskApp;
