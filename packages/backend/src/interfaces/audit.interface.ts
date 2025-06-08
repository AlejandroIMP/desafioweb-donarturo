export interface IAuditLog {
  audit_id?: number;
  table_name: string;
  operation_type: 'I' | 'U' | 'D'; // Insert, Update, Delete
  record_id: number;
  old_values?: string;
  new_values?: string;
  user_id?: number;
  operation_date?: Date;
  ip_address?: string;
  user_agent?: string;
}

export interface IErrorLog {
  error_id?: number;
  error_number?: number;
  error_severity?: number;
  error_state?: number;
  error_procedure?: string;
  error_line?: number;
  error_message?: string;
  user_id?: number;
  error_date?: Date;
  additional_info?: string;
}
