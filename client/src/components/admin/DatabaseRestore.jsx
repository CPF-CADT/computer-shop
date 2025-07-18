import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FaFileArchive, FaDatabase, FaHdd, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { apiService } from '../../service/api'; 
export default function DatabaseRestore() {
    const [restoreType, setRestoreType] = useState('fullIncremental');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFullBackup, setSelectedFullBackup] = useState(null);
    const [backupFile, setBackupFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreProgress, setRestoreProgress] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [errorState, setErrorState] = useState(null);

    const timerIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            clearInterval(timerIntervalRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const files = await apiService.getFileRecovery();
                setBackupFiles(files);
            } catch (err) {
                setErrorState(err.message);
                console.error("Failed to fetch backup file data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStartRestore = async () => {
        setIsRestoring(true);
        setIsComplete(false);
        setErrorState(null);
        setRestoreProgress(0);
        setElapsedTime(0);

       
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);

      
        setRestoreProgress(10); 

        const fileNamesToSend = selectedFiles.map(file => file.name);

        try {
            setRestoreProgress(50);
            
            const result = await apiService.startRecovery(fileNamesToSend);
            
            setRestoreProgress(100);
            setIsComplete(true);
            console.log('Recovery successful:', result.message);

        } catch (error) {
            setErrorState(error.message);
            setRestoreProgress(100); 
        } finally {
            clearInterval(timerIntervalRef.current);
            setIsRestoring(false);
        }
    };

    const handleReset = () => {
        setRestoreType('fullIncremental');
        setSelectedFiles([]);
        setSelectedFullBackup(null);
        setIsRestoring(false);
        setIsComplete(false);
        setErrorState(null);
        setRestoreProgress(0);
        setElapsedTime(0);
    };

    const handleRestoreTypeChange = (event) => {
        setRestoreType(event.target.value);
        setSelectedFiles([]);
        setSelectedFullBackup(null);
    };

    const handleFileSelect = (file) => {
        let newSelectedFiles = [...selectedFiles];

        if (file.type.toLowerCase() === 'full') {
            if (selectedFullBackup?.id === file.id) {
                setSelectedFullBackup(null);
                newSelectedFiles = [];
            } else {
                setSelectedFullBackup(file);
                newSelectedFiles = [file];
            }
        } else if (file.type.toLowerCase() === 'incremental') {
            const isSelected = newSelectedFiles.some(f => f.id === file.id);
            if (isSelected) {
                const allIncrementalsForBase = backupFile
                    .filter(f => f.baseFullId === file.baseFullId && f.type.toLowerCase() === 'incremental')
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                const deselectedIndex = allIncrementalsForBase.findIndex(f => f.id === file.id);
                const idsToRemove = allIncrementalsForBase.slice(deselectedIndex).map(f => f.id);
                newSelectedFiles = newSelectedFiles.filter(f => !idsToRemove.includes(f.id));
            } else {
                newSelectedFiles.push(file);
            }
        } else if (file.type.toLowerCase() === 'differential') {
            const isSelected = newSelectedFiles.some(f => f.id === file.id);
            newSelectedFiles = newSelectedFiles.filter(f => f.type.toLowerCase() !== 'differential');
            if (!isSelected) newSelectedFiles.push(file);
        }
        newSelectedFiles.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSelectedFiles(newSelectedFiles);
    };

    const isFileSelectionValid = useMemo(() => {
        if (!selectedFullBackup) return false;
        if (restoreType === 'fullOnly') return selectedFiles.length === 1;
        if (restoreType === 'fullIncremental') return selectedFiles.length > 1;
        if (restoreType === 'fullDifferential') {
            return selectedFiles.length === 2 && selectedFiles.some(f => f.type.toLowerCase() === 'differential');
        }
        return false;
    }, [selectedFiles, selectedFullBackup, restoreType]);

    const getFileTagColor = (type) => {
        switch (type.toLowerCase()) {
            case 'full': return 'bg-blue-100 text-blue-800';
            case 'incremental': return 'bg-green-100 text-green-800';
            case 'differential': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString();
    
    const primaryFiles = useMemo(() => backupFile.filter(f => f.type.toLowerCase() === 'full'), [backupFile]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-orange-500 text-4xl" />
                <span className="ml-4 text-xl text-gray-700">Loading Backups...</span>
            </div>
        );
    }
    
    if (errorState && !isRestoring && !isComplete) {
        return (
             <div className="flex flex-col justify-center items-center h-screen bg-red-50">
                <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
                <h2 className="text-2xl text-red-800 font-semibold mb-2">Failed to Load Data</h2>
                <p className="text-md text-red-600">{errorState}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <FaDatabase className="mr-3 text-orange-500" />
                        Database Restore Panel
                    </h1>
                    {(isRestoring || isComplete) && (
                        <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
                            Done
                        </button>
                    )}
                </div>

                {(isRestoring || isComplete) && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex items-center gap-4">
                            {errorState && <FaExclamationTriangle className="text-red-500 text-4xl" />}
                            {!errorState && isComplete && <FaCheckCircle className="text-green-500 text-4xl" />}
                            {isRestoring && <FaSpinner className="animate-spin text-blue-500 text-4xl" />}
                            <div className="w-full">
                                <h2 className="text-lg font-medium text-gray-800">
                                    {isRestoring && 'Restore in Progress...'}
                                    {isComplete && !errorState && 'Restore Successful'}
                                    {isComplete && errorState && 'Restore Failed'}
                                </h2>
                                {errorState && <p className="text-sm text-red-600">{errorState}</p>}
                                {!errorState && <p className="text-sm text-gray-500">Total time: {elapsedTime} seconds</p>}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className={`h-4 rounded-full transition-all duration-500 ${errorState ? 'bg-red-600' : 'bg-green-600'}`}
                                    style={{ width: `${restoreProgress}%` }}
                                ></div>
                            </div>
                            <span className="font-mono text-gray-600">{Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                )}

                <fieldset disabled={isRestoring || isComplete || isLoading} className={`${isRestoring || isComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">1. Select Restore Type</h2>
                        <div className="flex flex-col sm:flex-row sm:space-x-8">
                            {['fullOnly', 'fullIncremental', 'fullDifferential'].map(type => (
                                <label key={type} className="flex items-center space-x-2 text-gray-600">
                                    <input type="radio" name="restoreType" value={type} checked={restoreType === type} onChange={handleRestoreTypeChange} className="form-radio h-4 w-4 text-orange-600" />
                                    <span>{type === 'fullOnly' ? 'Full Restore Only' : `Full + ${type.includes('Inc') ? 'Incremental' : 'Differential'}`}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-700">2. Select Backup Files</h2>
                            {restoreType !== 'fullOnly' && <p className="text-sm text-gray-500 mt-2">Select a full backup to reveal its related backups.</p>}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-16"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {primaryFiles.map(fullBackup => {
                                        const isSelected = selectedFullBackup?.id === fullBackup.id;
                                        const isDeEmphasized = selectedFullBackup && !isSelected;
                                        const children = backupFile
                                            .filter(child => child.baseFullId === fullBackup.name &&
                                                ((restoreType === 'fullIncremental' && child.type.toLowerCase() === 'incremental') || (restoreType === 'fullDifferential' && child.type.toLowerCase() === 'differential')))
                                            .sort((a, b) => new Date(a.date) - new Date(b.date));
                                        const lastSelectedIncrementalIndex = children.findLastIndex(child => selectedFiles.some(f => f.id === child.id));

                                        return (
                                            <React.Fragment key={fullBackup.id}>
                                                <tr className={`${isSelected ? 'bg-blue-50' : ''} ${isDeEmphasized ? 'opacity-50' : ''} transition-opacity`}>
                                                    <td className="px-6"><input type="checkbox" checked={isSelected} onChange={() => handleFileSelect(fullBackup)} className="form-checkbox h-5 w-5 text-orange-600 rounded" /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center"><FaFileArchive className="mr-3 text-gray-600" />{fullBackup.name}</td>
                                                    <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFileTagColor(fullBackup.type)}`}>{fullBackup.type}</span></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(fullBackup.date)}</td>
                                                </tr>
                                                {isSelected && children.map((childFile, index) => {
                                                    const isChildChecked = selectedFiles.some(f => f.id === childFile.id);
                                                    const isDisabled = restoreType === 'fullIncremental' && index > lastSelectedIncrementalIndex + 1;
                                                    return (
                                                        <tr key={childFile.id} className={`${isChildChecked ? 'bg-orange-100' : 'bg-gray-50'} ${isDisabled ? 'opacity-60' : ''}`}>
                                                            <td className="px-6"><input type="checkbox" checked={isChildChecked} disabled={isDisabled} onChange={() => handleFileSelect(childFile)} className="form-checkbox h-5 w-5 text-orange-600 rounded disabled:bg-gray-300 disabled:cursor-not-allowed" /></td>
                                                            <td className="pl-12 pr-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center"><FaFileArchive className="mr-3 text-gray-500" />{childFile.name}</td>
                                                            <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFileTagColor(childFile.type)}`}>{childFile.type}</span></td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(childFile.date)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </fieldset>

                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={handleStartRestore} disabled={!isFileSelectionValid || isRestoring || isComplete}
                        className={`flex items-center justify-center px-6 py-3 w-48 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors
                            ${(!isFileSelectionValid || isRestoring || isComplete) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}>
                        {isRestoring && <><FaSpinner className="animate-spin mr-2" /> Restoring...</>}
                        {isComplete && !errorState && <><FaCheckCircle className="mr-2" /> Complete</>}
                        {isComplete && errorState && <><FaExclamationTriangle className="mr-2" /> Failed</>}
                        {!isRestoring && !isComplete && <><FaHdd className="mr-2" /> Start Restore</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
