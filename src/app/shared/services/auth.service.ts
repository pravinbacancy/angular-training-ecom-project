import { Injectable } from "@angular/core";
import { User } from "../services/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { ApiHttpService } from "./api-http.service";
import { NotificationService } from "./notification.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: "root",
})
export class AuthService {
    userData: any; // Save logged in user data
    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private apiHttpService: ApiHttpService,
        private notify: NotificationService,
        private spinnerService: NgxSpinnerService,
    ) {
        /* Saving user data in localstorage when logged in and setting up null when logged out */
        this.afAuth.authState.subscribe((user) => {
            if (user) {
                this.userData = user;
                localStorage.setItem("user", JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem("user")!);
            } else {
                localStorage.setItem("user", "null");
                JSON.parse(localStorage.getItem("user")!);
            }
        });
    }

    // Sign in with email/password
    SignIn(email: string, password: string) {
        this.spinnerService.show();
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.spinnerService.hide();
                this.afAuth.authState.subscribe((user) => {
                    if (user) {
                        this.notify.showSuccess("Logged in successfully");
                        this.router.navigate(["home"]);
                    }
                });
            })
            .catch((error) => {
                this.spinnerService.hide();
                this.notify.showError(error.message);
            });
    }

    // Sign up with email/password
    SignUp(data: User) {
        this.spinnerService.show();
        return this.afAuth
            .createUserWithEmailAndPassword(data.email, data.password!)
            .then((response) => {
                this.spinnerService.hide();
                const userData: any = {
                    uid: response?.user?.uid,
                    email: response?.user?.email,
                    name: data.name,
                    dob: data.dob,
                    role: data.role ? data.role : "customer",
                };
                this.SetUserData(userData);
            })
            .catch((error) => {
                this.spinnerService.hide();
                this.notify.showError(error.message);
            });
    }

    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem("user")!);
        return user !== null;
    }

    SetUserData(data: any) {
        this.apiHttpService.post("/users.json", data).subscribe({
            next: (response) => {
                this.notify.showSuccess("Account created successfully");
                this.router.navigate(["home"]);
            },
            error: (response) => {
                this.notify.showError(response.error.message);
            },
        });
    }

    // Sign out
    SignOut() {
        this.spinnerService.show();
        return this.afAuth.signOut().then(() => {
            localStorage.removeItem("user");
            this.router.navigate(["/auth/login"]);
            this.spinnerService.hide();
        });
    }
}
