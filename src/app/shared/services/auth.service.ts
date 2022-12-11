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
    
    loggedInUserData: any; // Save logged in user data

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private apiHttpService: ApiHttpService,
        private notify: NotificationService,
        private spinnerService: NgxSpinnerService,
    ) { }

    // Sign in with email/password
    SignIn(email: string, password: string) {
        this.spinnerService.show();
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then(async (result) => {
                this.spinnerService.hide();
                if (result.user) {
                    this.loggedInUserData = result.user;
                    await this.GetUserData(result.user.uid);
                    this.notify.showSuccess("Logged in successfully");
                    const user = JSON.parse(localStorage.getItem("user")!);
                    if(user && user.role === 'admin'){
                        this.router.navigate(["/admin/dashboard"]);
                    }else{
                        this.router.navigate(["home"]);
                    }
                }
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
                if(response && response.user){
                    this.loggedInUserData = response.user;
                    const userData: any = {
                        uid: response?.user?.uid,
                        email: response?.user?.email,
                        name: data.name,
                        dob: data.dob,
                        role: data.role ? data.role : "customer",
                    };
                    this.SetUserData(userData);
                }
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

    get getLoggedInUser(): any {
        return JSON.parse(localStorage.getItem("user")!);
    }

    StoreUserData(user: any){
        localStorage.setItem("user", JSON.stringify({...this.loggedInUserData, ...user}));
    }

    GetUserData(uid: string) {
        return new Promise(resolve => {
            this.apiHttpService.get(`/users/${uid}.json`).subscribe({
                next: (response) => {
                    this.StoreUserData(response);
                    resolve('resolved');
                },
                error: (response) => {
                    this.notify.showError(response.error.message);
                },
            });
        });
    }

    SetUserData(data: any) {
        this.apiHttpService.put(`/users/${data.uid}.json`, data).subscribe({
            next: (response) => {
                this.StoreUserData(response);
                this.notify.showSuccess("Account created successfully");
                if(response && response.role === 'admin'){
                    this.router.navigate(["/admin/dashboard"]);
                }else{
                    this.router.navigate(["home"]);
                }
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
