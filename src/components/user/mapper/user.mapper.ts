import { Doctor, Patient, User } from '.prisma/client';

export function mapToCreateUserQuery(user: User, patient?: Patient, doctor?: Doctor) {
  return {
    email: user.email,
    password: user.password,
    identification: user.identification,
    idType: user.idType,
    role: user.role,
    ...(patient ? {
      patient: {
        create: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          birthdate: patient.birthdate,
          phone: patient.phone,
          bloodType: patient.bloodType,
          height: patient.height,
          weight: patient.weight,
          status: patient.status,
        },
      },
    } : {}),
    ...(doctor ? {
      doctor: {
        create: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          birthdate: doctor.birthdate,
          phone: doctor.phone,
          specialty: doctor.specialty,
          tuitionNumber: doctor.tuitionNumber,
          medicalCenter: { connect: { id: doctor.medicalCenterId } },
        },
      },
    } : {}),
  };
}

export function mapToUpdateUserQuery(user: User, patient?: Patient, doctor?: Doctor) {
  return {
    email: user.email,
    ...(patient ? {
      patient: {
        update: {
          phone: patient.phone,
          bloodType: patient.bloodType,
          height: patient.height,
          weight: patient.weight,
        },
      },
    } : {}),
    ...(doctor ? {
      doctor: {
        update: {
          phone: doctor.phone,
        },
      },
    } : {}),
  };
}

export function mapToUpdateFullUserQuery(user: User, patient?: Patient, doctor?: Doctor) {
  return {
    email: user.email,
    ...(patient ? {
      patient: {
        update: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          birthdate: patient.birthdate,
          phone: patient.phone,
          bloodType: patient.bloodType,
          height: patient.height,
          weight: patient.weight,
          status: patient.status,
        },
      },
    } : {}),
    ...(doctor ? {
      doctor: {
        update: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          birthdate: doctor.birthdate,
          phone: doctor.phone,
          specialty: doctor.specialty,
          tuitionNumber: doctor.tuitionNumber,
          medicalCenterId: doctor.medicalCenterId,
        },
      },
    } : {}),
  };
}
