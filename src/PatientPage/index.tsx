import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { Patient } from '../types';

import { apiBaseUrl } from '../constants';
import { useStateValue } from '../state';
import { Icon } from 'semantic-ui-react';

const genderIcon = {
	male: { name: 'mars' as 'mars', color: 'blue' as 'blue' },
	female: { name: 'venus' as 'venus', color: 'pink' as 'pink' },
	other: { name: 'genderless' as 'genderless', color: 'yellow' as 'yellow' },
};

const PatientPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [{ patientDetails }, dispatch] = useStateValue();
	const [patient, setPatient] = React.useState<Patient | undefined>();

	React.useEffect(() => {
		const fetchSinglePatient = async () => {
			try {
				const { data: patient } = await axios.get<Patient>(
					`${apiBaseUrl}/patients/${id}`
				);
				dispatch({ type: 'FETCHED_PATIENT', payload: patient });
				setPatient(patient);
			} catch (e) {
				console.error(e);
			}
		};

		if (patientDetails[id]) {
			console.log('Already exists!');
			setPatient(patientDetails[id]);
		} else {
			console.log('Must fetch!');
			fetchSinglePatient();
		}
	}, [dispatch, id, patientDetails]);

	if (!patient) {
		return <div>Loading...</div>;
	}
	return (
		<div>
			<h2>
				{patient.name} <Icon {...genderIcon[patient.gender]} />
			</h2>
			<p>Ssn: {patient.ssn}</p>
			<p>Occupation: {patient.occupation}</p>
		</div>
	);
};

export default PatientPage;
