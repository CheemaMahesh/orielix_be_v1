import { Router } from "express";

import {
  SignUpController,
  SigninController,
  MeController,
  UpdateUserController,
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
} from "../controllers/Preferences";

export const userRouter = Router();

// Auth routes
userRouter.post("/signup", SignUpController);
userRouter.post("/login", SigninController);
userRouter.get("/me", MeController);
userRouter.put("/update", isValidToken, UpdateUserController); //Unfinished

// -------------------------------------Onboarding-------------------------------------
userRouter.patch("/firststep", OnboardingStepOneController);
userRouter.patch("/secondstep", OnboardingStepTwoController);
userRouter.patch("/thirdstep", OnboardingStepThreeController);
userRouter.patch("/fourthstep", OnboardingStepFourController);

// -------------------------------------Onboarding-User-Preferences-------------------------------------
userRouter.get("/getallintrest", getallintrestsController);
userRouter.get("/getallroles", getallrolesController);
