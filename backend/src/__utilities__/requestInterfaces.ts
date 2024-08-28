import express, { Request, Response, NextFunction } from 'express';
import { Restaurant } from '../models/Restaurant';
import { Employee } from '../models/Employee';
import { RestaurantInterface } from '../models/RestaurantInterface';

export interface AdminRequest extends Request {
    restaurant?: Restaurant;
}

export interface EmployeeRequest extends Request {
    employee?: Employee;
    colNum?: string;
}

export interface InterfaceRequest extends Request {
    restaurantInterface?: RestaurantInterface;
}