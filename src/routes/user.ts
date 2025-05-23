import { Router } from "express";

import {
  SignUpController,
  SigninController,
  MeController,
  UpdateUserController,
  GetAllEventsForCustomerController,
  getAllSessionsController,
  getAllUserByAdmin,
  UpdateIntrestsController,
  DeleteIntrestController,
  UpdateBioController,
  UpdateNamesController,
  JoinWithGoogleAuth,
} from "../controllers/Users";
import { isValidToken } from "../middlewares/auth";
import {
  OnboardingStepOneController,
  OnboardingStepTwoController,
  OnboardingStepThreeController,
  OnboardingStepFourController,
} from "../controllers/Onboarding";
import {
  getallintrestsController,
  getallrolesController,
  joinInEventController,
  leaveEventController,
  JoinInSessionController,
  LeaveSessionController,
} from "../controllers/Preferences";

export const userRouter = Router();

// Auth routes
userRouter.post("/signup", SignUpController);
userRouter.post("/login", SigninController);
userRouter.get("/me", isValidToken, MeController);
// userRouter.put("/update", isValidToken, UpdateUserController); //Unfinished
userRouter.get("/getall", isValidToken, getAllUserByAdmin);
userRouter.post("/intrest/update", isValidToken, UpdateIntrestsController);
userRouter.delete(
  "/delete/intrest/:intrestId",
  isValidToken,
  DeleteIntrestController
);

userRouter.patch("/update/bio", isValidToken, UpdateBioController);
userRouter.patch("/update/names", isValidToken, UpdateNamesController);

// -------------------------------------Onboarding-------------------------------------
userRouter.patch("/firststep", OnboardingStepOneController);
userRouter.patch("/secondstep", OnboardingStepTwoController);
userRouter.patch("/thirdstep", OnboardingStepThreeController);
userRouter.patch("/fourthstep", OnboardingStepFourController);

// -------------------------------------Onboarding-User-Preferences-------------------------------------
userRouter.get("/getallintrest", isValidToken, getallintrestsController);
userRouter.get("/getallroles", isValidToken, getallrolesController);
userRouter.get(
  "/getallevents",
  isValidToken,
  GetAllEventsForCustomerController
);
userRouter.get("/getallsessions", isValidToken, getAllSessionsController);
// -----------------------------------Join or Leave -------------------------------------
userRouter.post("/join/event/:eventId", isValidToken, joinInEventController);
userRouter.post("/leave/event/:eventId", isValidToken, leaveEventController);
userRouter.post(
  "/join/session/:sessionId",
  isValidToken,
  JoinInSessionController
);
userRouter.post(
  "/leave/session/:sessionId",
  isValidToken,
  LeaveSessionController
);

// -------------------------------------Google Auth - --------------------------------------
userRouter.post("/google", JoinWithGoogleAuth);
