"use client"

export function ValidateEmail(email) {
  if(email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    return false
  }
  else if(email === '') {
    return true
  }
  else {
      return true
  }
}

export function ValidatePassword(password) {
  if(password.length < 8) {
    return true
  }else {
    return false
  }
}